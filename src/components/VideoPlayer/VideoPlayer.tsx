/**
 * Created by user on 09.10.18.
 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const style = require('./VideoPlayer.scss');

export default class VideoPlayer extends React.Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        brightness: PropTypes.number,
        contrast: PropTypes.number,
        element: PropTypes.func,
        muted: PropTypes.bool,
    };

    static defaultProps = {
        muted: false,
    };

    componentDidMount() {
        this.initVideo();
    }

    render() {
        let filters = [];
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
                       if (this.props.element) this.props.element(video);
                   }}
                   style={{filter: filters.join(' ')}}
            />
        )
    }

    initVideo() {

        if (Hls && Hls.isSupported()) {
            let hls = new Hls();
            hls.loadSource(this.props.url);
            hls.attachMedia(this.video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                this.video.play();
            });
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = this.props.url;
            this.video.addEventListener('loadedmetadata', this.video.play);
        }
    }
}