/**
 * Created by user on 14.10.18.
 */

import React from 'react';
import AudioAnalyser from '../../helpers/AudioAnalyser';
import BarDiagram from '../BarDiagram/BarDiagram';

const style = require('./VideoControls.scss');

interface IVideoControls {
    brightness: number;
    onUpdateBrightness: (value: number) => void;
    contrast: number;
    onUpdateContrast: (value: number) => void;
    onClose: () => void;
    analyser: AudioAnalyser;

    width: number;
    height: number;

    detector: boolean;
    onDetector: () => void;

    showDelta: boolean;
    skip: number;
    frameForAnalise: number;
    stepX: number;
    stepY: number;
    threshold: number;

    onUpdateShowDelta: (value: boolean) => void;
    onUpdateSkip: (value: number) => void;
    onUpdateFrameForAnalise: (value: number) => void;
    onUpdateStepX: (value: number) => void;
    onUpdateStepY: (value: number) => void;
    onUpdateThreshold: (value: number) => void;

    video: HTMLVideoElement;
}

export default class VideoControls extends React.Component<IVideoControls> {

    private canvas: HTMLCanvasElement | null = null;
    private canvasContext: CanvasRenderingContext2D | null = null;
    private interval = 0;

    public state = {
        show: true,
        light: 50,
    };

    public componentDidMount() {
        if (!this.canvas) return;

        this.canvasContext = this.canvas.getContext('2d');
        this.interval = window.setInterval(() => {
            if (!this.canvasContext) return;

            this.canvasContext.drawImage(this.props.video, 0, 0, 10, 10);
            const data = this.canvasContext.getImageData(0, 0, 10, 10).data;
            let sum = 0;

            for (let x = 0; x < data.length; x += 4) {
                // r+g+b без alpha
                sum += data[x] + data[x + 1] + data[x + 2];
            }

            // сумма делится на количество при учете 3 из 4 пикселей
            this.setState({light: Math.floor(sum / (data.length / 4 * 3) / 255 * 100)});
        }, 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        // Сложность анализа одного кадра для детектора движения
        const complexity = Math.floor(this.props.width * this.props.height /
            this.props.stepX / this.props.stepY * (this.props.frameForAnalise - 1));

        return (
            <div className={style['normal']} onClick={e => e.stopPropagation()}>

                {!this.state.show ? null :
                    <>
                        {!this.props.detector ? null :
                            <>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Сложность: {(complexity / 1000).toFixed(1)}k
                                    </div>
                                    <div className={style['text']}>
                                        Разрешение: {this.props.width}x{this.props.height}
                                    </div>
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Отображать разницу:
                                    </div>
                                    <input type="checkbox"
                                           checked={this.props.showDelta}
                                           onChange={() => this.props.onUpdateShowDelta(!this.props.showDelta)}
                                    />
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Пропуск кадров:{this.props.skip}
                                    </div>
                                    <input type="range" min={1} max={60}
                                           value={this.props.skip}
                                           onChange={event => this.props.onUpdateSkip(+event.target.value)}
                                    />
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Кадров для анализа:{this.props.frameForAnalise}
                                    </div>
                                    <input type="range" min={2} max={60}
                                           value={this.props.frameForAnalise}
                                           onChange={event => this.props.onUpdateFrameForAnalise(+event.target.value)}
                                    />
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Точность по X:{this.props.stepX}
                                    </div>
                                    <input type="range" min={1} max={60}
                                           value={this.props.stepX}
                                           onChange={event => this.props.onUpdateStepX(+event.target.value)}
                                    />
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Точность по Y:{this.props.stepY}
                                    </div>
                                    <input type="range" min={1} max={60}
                                           value={this.props.stepY}
                                           onChange={event => this.props.onUpdateStepY(+event.target.value)}
                                    />
                                </div>
                                <div className={style['line']}>
                                    <div className={style['text']}>
                                        Погрешность:{this.props.threshold}
                                    </div>
                                    <input type="range" min={0} max={255}
                                           value={this.props.threshold}
                                           onChange={event => this.props.onUpdateThreshold(+event.target.value)}
                                    />
                                </div>
                            </>
                        }
                        <canvas width={10} height={10} ref={canvas => this.canvas = canvas} style={{display: 'none'}}/>
                        <div className={style['text']}>
                            Освещённость: {this.state.light}%
                        </div>
                        <div className={style['line']}>
                            <div className={style['text']}>
                                Контрастность
                            </div>
                            <input type="range" min={0.05} max={2} step={0.05}
                                   onChange={event => this.props.onUpdateContrast(+event.target.value)}
                                   value={this.props.contrast}
                            />
                        </div>
                        <div className={style['line']}>
                            <div className={style['text']}>
                                Яркость
                            </div>
                            <input type="range" min={0.05} max={2} step={0.05}
                                   onChange={event => this.props.onUpdateBrightness(+event.target.value)}
                                   value={this.props.brightness}
                            />
                        </div>
                        <BarDiagram analyser={this.props.analyser}/>
                        <div className={style['line']}>
                            <div className={style['button']} onClick={this.props.onDetector}>
                                {this.props.detector ? 'Выключить детектор' : 'Включить детектор'}
                            </div>
                        </div>
                    </>
                }
                <div className={style['line']}>
                    <div className={style['button']}
                         onClick={() => this.setState({show: !this.state.show})}
                    >
                        {this.state.show ? 'Скрыть настройки' : 'Показать настройки'}
                    </div>
                    <div className={style['button']} onClick={this.props.onClose}>
                        Все камеры
                    </div>
                </div>
            </div>
        );
    }
}