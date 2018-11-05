/**
 * Created by user on 17.10.18.
 */

import React from 'react';
import MoveDetector from '../../helpers/MoveDetector';

const style = require('./CanvasMoveDetector.scss');

interface ICanvasMoveDetector {
    brightness: number;
    contrast: number;

    video: HTMLVideoElement;
    width: number;
    height: number;
    top: number;
    left: number;

    showDelta: boolean;
    skip: number;
    frameForAnalise: number;
    stepX: number;
    stepY: number;
    threshold: number;
}

export default class CanvasMoveDetector extends React.Component<ICanvasMoveDetector> {

    private canvas: HTMLCanvasElement | null = null;
    private canvasContext: CanvasRenderingContext2D | null = null;
    private MoveDetector: MoveDetector | null = null;

    private count = 0;
    private change: number[][] = [];
    private rect = [0, 0, 0, 0];
    private frame = 0;
    private i = 0;

    public componentDidMount() {
        if (!this.canvas) return;

        this.canvasContext = this.canvas.getContext('2d');
        if (!this.canvasContext) return;
        this.canvasContext.fillStyle = 'rgb(255, 0, 0)';
        this.canvasContext.strokeStyle = 'rgb(255, 0, 0)';

        this.MoveDetector = new MoveDetector(
            this.props.width, this.props.height,
            this.props.frameForAnalise,
            this.props.stepX, this.props.stepY,
            this.props.threshold,
            this.onCheck.bind(this),
        );

        this.loop();
    }

    public componentDidUpdate() {
        if (!this.MoveDetector) return null;
        this.MoveDetector.width = this.props.width;
        this.MoveDetector.height = this.props.height;

        this.MoveDetector.frameForAnalise = this.props.frameForAnalise;
        this.MoveDetector.stepX = this.props.stepX;
        this.MoveDetector.stepY = this.props.stepY;
        this.MoveDetector.threshold = this.props.threshold;
    }

    public componentWillUnmount() {
        cancelAnimationFrame(this.frame);
    }

    public render() {
        const filters = [];
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
                        left: this.props.left,
                    }}
            />
        );
    }

    private loop = () => {
        if (!this.canvasContext || !this.MoveDetector) return null;
        this.canvasContext.drawImage(this.props.video, 0, 0, this.props.width, this.props.height);

        this.count++;
        // Пропуск кадров для анализа
        if (this.count >= this.props.skip) {
            this.count = 0;
            this.MoveDetector.addData(this.canvasContext.getImageData(0, 0, this.props.width, this.props.height).data);
        }

        // Точки движения
        if (this.props.showDelta) {
            for (this.i = this.change.length; this.i--;) {
                this.canvasContext.fillRect(this.change[this.i][0] - 2, this.change[this.i][1] - 2, 5, 5);
            }
        }

        // Рамка движения
        if (this.change.length) {
            this.canvasContext.strokeRect(this.rect[0] - 10, this.rect[1] - 10, this.rect[2] + 20, this.rect[3] + 20);
        }

        this.frame = requestAnimationFrame(this.loop);
    }

    private onCheck(change: number[][], rect: [0, 0, 0, 0]) {
        this.change = change;
        this.rect = rect;
    }
}