/**
 * Created by user on 12.10.18.
 */

import React from 'react';
import {changeBrightness, changeContrast} from '../../actions/actions';
import AudioAnalyser from '../../helpers/AudioAnalyser';
import CanvasMoveDetector from '../CanvasMoveDetector/CanvasMoveDetector';
import VideoControls from '../VideoControls/VideoControls';
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const style = require('./Video.scss');

interface IVideoProps {
    url: string;
    brightness: number;
    contrast: number;
}

interface IVideoState {
    fullscreen: boolean;
    relative: boolean;

    detector: boolean;
    showDelta: boolean;
    skip: number;
    frameForAnalise: number;
    stepX: number;
    stepY: number;
    threshold: number;

    width: number;
    height: number;
    top: number;
    left: number;

    analyser: AudioAnalyser | null;
}

export default class Video extends React.Component<IVideoProps, IVideoState> {

    public state: IVideoState = {
        fullscreen: false,
        relative: false,

        detector: false, // детектор движения

        showDelta: false, // скрывать разницу в пикселях
        skip: 2, // Пропуск кадров
        frameForAnalise: 5, // Количество кадров для анализа движения
        stepX: 5, // Точность по X
        stepY: 5, // Точность по Y
        threshold: 70, // Погрешность в отклонении цвета пикселя

        width: 0,
        height: 0,
        top: 0,
        left: 0,

        analyser: null,
    };

    private video: HTMLVideoElement | null = null;
    private detectorResizeHack: boolean = false;

    public render() {
        return (
            <div className={this.state.relative ? style['relative'] : null}
                 onClick={this.onClickHandler.bind(this)}
            >
                {this.state.fullscreen ? <div className={style['background']}/> : null}
                {!this.state.detector || !this.video ? null :
                    <CanvasMoveDetector contrast={this.props.contrast}
                                        brightness={this.props.brightness}

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
                             contrast={this.props.contrast}
                             brightness={this.props.brightness}
                             muted={!this.state.fullscreen}
                             className={this.state.detector ? style['hide'] : style['video']}
                />
                {this.state.fullscreen ? this.renderControls() : null}
            </div>
        );
    }

    private renderControls() {
        if (!this.state.analyser || !this.video) return null;

        return (
            <VideoControls brightness={this.props.brightness}
                           onUpdateBrightness={brightness => changeBrightness(brightness, this.props.url)}
                           contrast={this.props.contrast}
                           onUpdateContrast={contrast => changeContrast(contrast, this.props.url)}
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
        );
    }

    private onChangeDetect() {
        const detector = !this.state.detector;
        if (detector && this.video) {
            const {width, height, x: left, y: top} = this.video.getBoundingClientRect() as DOMRect;

            this.setState({width: Math.floor(width), height: Math.floor(height), top, left});
        }
        this.setState({detector});
    }

    private onClickHandler() {
        // Выключаем канвас, что бы плавно анамировать видео
        if (this.state.detector) {
            this.setState({detector: false});
            setTimeout(this.onClickHandler.bind(this), 16);
            return false;
        }

        if (!this.state.analyser && this.video) {
            this.setState({analyser: new AudioAnalyser(this.video)});
        }

        const fullscreen = !this.state.fullscreen;

        // Запрет на раскрытие, во время сворачивания видео
        if (fullscreen && this.state.relative) return;

        // relative для решения проблем с наложением z-index во время анимаций
        if (fullscreen) {
            document.body.style.overflow = 'hidden';
            this.setState({relative: true});
            window.addEventListener('resize', this.onResize);
        } else {
            document.body.style.overflow = '';
            setTimeout(() => this.setState({relative: false}), 500);
            window.removeEventListener('resize', this.onResize);
        }

        this.scaleVideo(fullscreen);

        this.setState({fullscreen});
    }

    // Получение данных видео в оригинальном размере, без учета трансформаций
    private getRectWithoutTransform(video: HTMLVideoElement) {
        const transform = video.style.transform;
        video.style.transform = '';
        const rect = video.getBoundingClientRect() as DOMRect;
        video.style.transform = transform;
        return rect;
    }

    // Масштабируем видео
    private scaleVideo(fullscreen = this.state.fullscreen) {
        if (!this.video) return;
        let transform = '';

        if (fullscreen) {
            const {innerWidth, innerHeight} = window;

            const {width, height, x, y} = this.getRectWithoutTransform(this.video);

            const scale = Math.min(innerWidth / width, innerHeight / height);

            const tWidth = (innerWidth - width) / 2 - x;
            const tHeight = (innerHeight - height) / 2 - y;

            transform = `translate(${tWidth}px, ${tHeight}px) scale(${scale})`;
        }

        this.video.style.transform = transform;
    }

    // При изменении размера экрана, убираем анимацию
    private onResize = () => {
        if (!this.video) return;
        // Выключаем канвас, что бы корректно развернуть видео
        if (this.state.detector) {
            this.setState({detector: false});
            setTimeout(this.onResize, 16);
            this.detectorResizeHack = true;
            return false;
        }
        // Хак на включение детектора движения после изменения размера
        if (this.detectorResizeHack) {
            this.detectorResizeHack = false;
            setTimeout(this.onChangeDetect.bind(this), 16);
        }
        const transition = this.video.style.transition;
        this.video.style.transition = 'none';
        // this.video.getBoundingClientRect();

        this.scaleVideo();

        this.video.getBoundingClientRect();
        this.video.style.transition = transition;
    }
}