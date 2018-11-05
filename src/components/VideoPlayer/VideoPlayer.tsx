/**
 * Created by user on 09.10.18.
 */

import classNames from 'classnames';
import Hls from 'hls.js';
import React from 'react';

const style = require('./VideoPlayer.scss');

interface IVideoPlayer {
    url: string;
    brightness: number;
    contrast: number;
    element: (element: HTMLVideoElement) => void;
    muted: boolean;
    className: string;
}

export default class VideoPlayer extends React.Component<IVideoPlayer> {

    private video: HTMLVideoElement | null = null;

    public componentDidMount() {
        this.initVideo();
    }

    public render() {
        const filters = [];
        if (this.props.brightness) filters.push(`brightness(${this.props.brightness})`);
        if (this.props.contrast) filters.push(`contrast(${this.props.contrast})`);

        const className = classNames(style['normal'], this.props.className);
        return (
            <video className={className}
                // controls
                   muted={this.props.muted}
                   autoPlay
                   loop
                   ref={video => {
                       this.video = video;
                       if (this.props.element && video) this.props.element(video);
                   }}
                   style={{filter: filters.join(' ')}}
            />
        );
    }

    private initVideo() {
        if (!this.video) return;
        if (Hls && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(this.props.url);
            hls.attachMedia(this.video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (this.video) this.video.play();
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = this.props.url;
            this.video.addEventListener('loadedmetadata', this.video.play);
        }
    }
}