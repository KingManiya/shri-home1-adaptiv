/**
 * Created by user on 17.10.18.
 */

import React from 'react'
import style from './CanvasMoveDetector.scss'
import MoveDetector from "../../helpers/MoveDetector";
import PropTypes from 'prop-types'

export default class CanvasMoveDetector extends React.Component {
    static propTypes = {
        brightness: PropTypes.number.isRequired,
        contrast: PropTypes.number.isRequired,

        video: PropTypes.any.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,

        showDelta: PropTypes.bool.isRequired,
        skip: PropTypes.number.isRequired,
        frameForAnalise: PropTypes.number.isRequired,
        stepX: PropTypes.number.isRequired,
        stepY: PropTypes.number.isRequired,
        threshold: PropTypes.number.isRequired,
    };

    componentDidMount() {
        this.canvasContext = this.canvas.getContext("2d");
        this.canvasContext.fillStyle = 'rgb(255, 0, 0)';
        this.canvasContext.strokeStyle = 'rgb(255, 0, 0)';

        this.MoveDetector = new MoveDetector(
            this.props.width, this.props.height,
            this.props.frameForAnalise,
            this.props.stepX, this.props.stepY,
            this.props.threshold,
            this.onCheck.bind(this)
        );

        this.count = 0;
        this.change = [];
        this.rect = [0, 0, 0, 0];

        this.loopHandler = this.loop.bind(this);
        this.loopHandler();
    }

    componentDidUpdate() {
        this.MoveDetector.width = this.props.width;
        this.MoveDetector.height = this.props.height;

        this.MoveDetector.frameForAnalise = this.props.frameForAnalise;
        this.MoveDetector.stepX = this.props.stepX;
        this.MoveDetector.stepY = this.props.stepY;
        this.MoveDetector.threshold = this.props.threshold;
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frame)
    }


    render() {
        let filters = [];
        if (this.props.brightness) filters.push(`brightness(${this.props.brightness})`);
        if (this.props.contrast) filters.push(`contrast(${this.props.contrast})`);


        return (
            <canvas ref={canvas => this.canvas = canvas}
                    className={style['normal']}
                    width={this.props.width}
                    height={this.props.height}

                    style={{
                        filter: filters.join(' '),
                        top: this.props.top,
                        left: this.props.left
                    }}
            />
        )
    }

    loop() {
        this.canvasContext.drawImage(this.props.video, 0, 0, this.props.width, this.props.height);

        this.count++;
        //Пропуск кадров для анализа
        if (this.count >= this.props.skip) {
            this.count = 0;
            this.MoveDetector.addData(this.canvasContext.getImageData(0, 0, this.props.width, this.props.height).data);
        }

        //Точки движения
        if (this.props.showDelta) {
            for (this.i = this.change.length; this.i--;) {
                this.canvasContext.fillRect(this.change[this.i][0] - 2, this.change[this.i][1] - 2, 5, 5);
            }
        }

        //Рамка движения
        if (this.change.length) {
            this.canvasContext.strokeRect(this.rect[0] - 10, this.rect[1] - 10, this.rect[2] + 20, this.rect[3] + 20);
        }

        this.frame = requestAnimationFrame(this.loopHandler);
    }

    onCheck(check, rect) {
        this.change = check;
        this.rect = rect;
    }
}