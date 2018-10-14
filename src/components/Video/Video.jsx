/**
 * Created by user on 12.10.18.
 */

import React from 'react'
import style from './Video.scss'
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import PropTypes from 'prop-types'
import AudioAnalyser from '../../helpers/AudioAnalyser'
import VideoControls from "../VideoControls/VideoControls";

export default class Video extends React.Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    state = {
        fullscreen: false,
        relative: false,
        contrast: 1,
        brightness: 1,
    };

    render() {
        return (
            <div className={this.state.relative ? style['relative'] : null}
                 onClick={this.onClickHandler.bind(this)}
            >
                {this.state.fullscreen ? <div className={style['background']}/> : null}
                <VideoPlayer url={this.props.url}
                             element={video => this.video = video}
                             contrast={this.state.contrast}
                             brightness={this.state.brightness}
                             muted={!this.state.fullscreen}
                             className={style['video']}
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
                           onClose={() => this.setState({fullscreen: false})}
                           analyser={this.state.analyser}
                           video={this.video}

            />
        )
    }

    onClickHandler() {
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
        let transition = this.video.style.transition;
        this.video.style.transition = 'none';
        // this.video.getBoundingClientRect();

        this.scaleVideo();

        this.video.getBoundingClientRect();
        this.video.style.transition = transition;
    }
}