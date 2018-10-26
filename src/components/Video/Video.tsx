/**
 * Created by user on 12.10.18.
 */

import React from 'react'
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import PropTypes from 'prop-types'
import AudioAnalyser from '../../helpers/AudioAnalyser'
import VideoControls from "../VideoControls/VideoControls";
import CanvasMoveDetector from "../CanvasMoveDetector/CanvasMoveDetector";

const style = require('./Video.scss');

export default class Video extends React.Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    state = {
        fullscreen: false,
        relative: false,
        contrast: 1,
        brightness: 1,

        detector: false, //детектор движения

        showDelta: false, //скрывать разницу в пикселях
        skip: 2, //Пропуск кадров
        frameForAnalise: 5, //Количество кадров для анализа движения
        stepX: 5, //Точность по X
        stepY: 5, //Точность по Y
        threshold: 70, //Погрешность в отклонении цвета пикселя

        width: 0,
        height: 0,
        top: 0,
        left: 0,
    };

    render() {
        return (
            <div className={this.state.relative ? style['relative'] : null}
                 onClick={this.onClickHandler.bind(this)}
            >
                {this.state.fullscreen ? <div className={style['background']}/> : null}
                {!this.state.detector ? null :
                    <CanvasMoveDetector contrast={this.state.contrast}
                                        brightness={this.state.brightness}

                                        video={this.video}
                                        width={this.state.width}
                                        height={this.state.height}
                                        top={this.state.top}
                                        left={this.state.left}

                                        showDelta={this.state.showDelta}
                                        skip={this.state.skip}
                                        frameForAnalise={this.state.frameForAnalise}
                                        stepX={this.state.stepX}
                                        stepY={this.state.stepY}
                                        threshold={this.state.threshold}
                    />
                }
                <VideoPlayer url={this.props.url}
                             element={video => this.video = video}
                             contrast={this.state.contrast}
                             brightness={this.state.brightness}
                             muted={!this.state.fullscreen}
                             className={this.state.detector ? style['hide'] : style['video']}
                />
                {this.state.fullscreen ? this.renderControls() : null}
            </div>
        );
    }

    renderControls() {
        return (
            <VideoControls brightness={this.state.brightness}
                           onUpdateBrightness={brightness => this.setState({brightness})}
                           contrast={this.state.contrast}
                           onUpdateContrast={contrast => this.setState({contrast})}
                           onClose={this.onClickHandler.bind(this)}
                           analyser={this.state.analyser}
                           video={this.video}

                           width={this.state.width}
                           height={this.state.height}

                           detector={this.state.detector}
                           onDetector={this.onChangeDetect.bind(this)}

                           showDelta={this.state.showDelta}
                           skip={this.state.skip}
                           frameForAnalise={this.state.frameForAnalise}
                           stepX={this.state.stepX}
                           stepY={this.state.stepY}
                           threshold={this.state.threshold}

                           onUpdateShowDelta={showDelta => this.setState({showDelta})}
                           onUpdateFrameForAnalise={frameForAnalise => this.setState({frameForAnalise})}
                           onUpdateSkip={skip => this.setState({skip})}
                           onUpdateStepX={stepX => this.setState({stepX})}
                           onUpdateStepY={stepY => this.setState({stepY})}
                           onUpdateThreshold={threshold => this.setState({threshold})}

            />
        )
    }

    onChangeDetect() {
        let detector = !this.state.detector;
        if (detector) {
            const {width, height, x: left, y: top} = this.video.getBoundingClientRect();

            this.setState({width: Math.floor(width), height: Math.floor(height), top, left});
        }
        this.setState({detector});
    }

    onClickHandler() {
        //Выключаем канвас, что бы плавно анамировать видео
        if (this.state.detector) {
            this.setState({detector: false});
            setTimeout(this.onClickHandler.bind(this), 16);
            return false;
        }


        if (!this.state.analyser) {
            this.setState({analyser: new AudioAnalyser(this.video)});
        }

        if (!this.resizeHandler) {
            this.resizeHandler = this.onResize.bind(this);
        }

        const fullscreen = !this.state.fullscreen;

        //Запрет на раскрытие, во время сворачивания видео
        if (fullscreen && this.state.relative) return;

        //relative для решения проблем с наложением z-index во время анимаций
        if (fullscreen) {
            document.body.style.overflow = 'hidden';
            this.setState({relative: true});
            window.addEventListener('resize', this.resizeHandler);
        } else {
            document.body.style.overflow = '';
            setTimeout(() => this.setState({relative: false}), 500);
            window.removeEventListener('resize', this.resizeHandler);
        }

        this.scaleVideo(fullscreen);

        this.setState({fullscreen});
    }


    //Получение данных видео в оригинальном размере, без учета трансформаций
    getRectWithoutTransform() {
        let transform = this.video.style.transform;
        this.video.style.transform = '';
        let rect = this.video.getBoundingClientRect();
        this.video.style.transform = transform;
        return rect;
    }

    //Масштабируем видео
    scaleVideo(fullscreen = this.state.fullscreen) {
        let transform = '';

        if (fullscreen) {
            const {innerWidth, innerHeight} = window;

            const {width, height, x, y} = this.getRectWithoutTransform();

            const scale = Math.min(innerWidth / width, innerHeight / height);

            const tWidth = (innerWidth - width) / 2 - x;
            const tHeight = (innerHeight - height) / 2 - y;

            transform = `translate(${tWidth}px, ${tHeight}px) scale(${scale})`;
        }

        this.video.style.transform = transform;
    }

    //При изменении размера экрана, убираем анимацию
    onResize() {
        //Выключаем канвас, что бы корректно развернуть видео
        if (this.state.detector) {
            this.setState({detector: false});
            setTimeout(this.onResize.bind(this), 16);
            this.detectorResizeHack = true;
            return false;
        }
        //Хак на включение детектора движения после изменения размера
        if (this.detectorResizeHack) {
            this.detectorResizeHack = false;
            setTimeout(this.onChangeDetect.bind(this), 16);
        }
        let transition = this.video.style.transition;
        this.video.style.transition = 'none';
        // this.video.getBoundingClientRect();

        this.scaleVideo();

        this.video.getBoundingClientRect();
        this.video.style.transition = transition;
    }
}