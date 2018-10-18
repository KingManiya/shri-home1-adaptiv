/**
 * Created by user on 13.10.18.
 */

import React from 'react'
import PropTypes from 'prop-types'

export default class BarDiagram extends React.Component {

    static propTypes = {
        analyser: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.canvasCtx = this.canvas.getContext("2d");

        this.props.analyser.addListener(bands => this.renderCanvas(bands));
    }

    componentWillUnmount() {
        this.props.analyser.removeListener();
    }

    render() {
        return (
            <canvas ref={canvas => this.canvas = canvas} style={{width: 270, height: 50}}/>
        )
    }

    renderCanvas(bands) {
        if (this.canvasCtx) {
            //Прозрачный фон
            this.canvasCtx.clearRect(0, 0, this.width, this.height);
            //Черный фон
            // this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            // this.canvasCtx.fillRect(0, 0, this.width, this.height);
            //Затемненный фон
            // this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            // this.canvasCtx.fillRect(0, 0, this.width, this.height);

            let barCount = bands.length;
            let barWidth = (this.width / barCount) - 1;
            let barHeight;
            let x = 0;

            for (let i = 0; i < barCount; i++) {
                let value = bands[i];

                //Линейная шкала
                // barHeight = value / 255 * this.height;
                //Логорифмическая шкала
                barHeight = Math.log2(value + 1) / Math.log2(255) * this.height;

                //Показываем маленькую плашку, если этот диапазон пустой
                if (barHeight === 0) barHeight = 5;
                this.canvasCtx.fillStyle = 'rgba(' + (value + 100) + ',50,50, 0.4)';
                this.canvasCtx.fillRect(x, this.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
    }
}