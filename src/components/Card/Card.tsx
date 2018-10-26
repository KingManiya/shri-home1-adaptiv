/**
 * Created by user on 02.10.18.
 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Player from "../Player/Player";
import Button from "../Button/Button";
import {
    changePoint,
    deletePoint,
    registerMove,
    registerPoint,
    registerRotate,
    registerScale
} from "../../helpers/gestures";
import CardTitle from "../CardTitle/CardTitle";
import CardInfo from "../CardInfo/CardInfo";
import Video from "../Video/Video";

const style = require('./Card.scss');

export default class Card extends React.Component {
    static propTypes = {
        // small: PropTypes.bool,
        // medium: PropTypes.bool,
        // large: PropTypes.bool,
    };

    state = {
        zoom: 2,
        positionPercentX: 50,
        positionPercentY: 50,
        contrast: 100,
    };

    componentDidMount() {
        if (this.bitmap) {
            this.bitmap.addEventListener('pointermove', changePoint);
            this.bitmap.addEventListener('pointerdown', registerPoint);
            this.bitmap.addEventListener('pointerup', deletePoint);
            this.bitmap.addEventListener('pointercancel', deletePoint);

            let contrast = 100;
            let imageX = 0;
            let imageY = 0;
            let tempZoom = 2;
            let zoom = 2;

            registerRotate(speed => {
                contrast += speed;
                if (contrast < 0) contrast = 0;
                if (contrast > 300) contrast = 300;
                this.bitmap.style.filter = `brightness(${contrast}%)`;
                this.setState({contrast});
            });


            registerMove((speedX, speedY) => {
                imageX += speedX / zoom;
                imageY += speedY / zoom;

                /*
                * zoom - отступ. 320 - половина от ширины в 640
                * 1-0   (320*0/1)
                * 2-160 (320*1/2)
                * 3-213 (320*2/3)
                * 4-240 (320*3/4)
                * */

                //Установка ограничения по тасканию картинки
                let width = this.bitmap.width;
                let height = this.bitmap.height;
                let x = width / 2 * (zoom - 1) / zoom;
                let y = height / 2 * (zoom - 1) / zoom;
                if (imageX >= x) imageX = x;
                if (imageY >= y) imageY = y;
                if (imageX <= -x) imageX = -x;
                if (imageY <= -y) imageY = -y;


                this.changeCamZoom(zoom, imageX, imageY);
                let positionPercentX = x ? (x - imageX) / (x * 2) * 100 : 100;
                let positionPercentY = y ? (y - imageY) / (y * 2) * 100 : 100;

                this.setState({positionPercentX, positionPercentY, zoom});
            });

            registerScale(speed => {
                zoom = tempZoom * speed;
                if (zoom < 1) zoom = 1;
                if (zoom > 10) zoom = 10;
                this.changeCamZoom(zoom, imageX, imageY);
            }, () => tempZoom = zoom);
        }
    }

    changeCamZoom(zoom, positionX, positionY) {
        this.bitmap.style.transform = `scale(${zoom}) translateX(${positionX}px) translateY(${positionY}px)`;
    }

    render() {
        let className = classNames(style['normal'], {
            [style['small']]: this.props.size === 's',
            [style['medium']]: this.props.size === 'm',
            [style['large']]: this.props.size === 'l',
            [style['critical']]: this.props.type === 'critical',
        });


        return (
            <div className={className}>
                <div className={style['cross']}/>
                <div className={style['next']}/>
                {this.renderMain()}
                {this.renderContent()}
            </div>
        )
    }

    renderMain() {
        const critical = this.props.type === 'critical';

        return (
            <div className={style['header']}>
                <CardTitle critical={critical} title={this.props.title} icon={this.props.icon}/>
                <CardInfo twoLine={this.props.size === 's'} source={this.props.source} time={this.props.time}/>
            </div>
        )
    }

    renderContent() {
        return (
            <div className={style['content']}>
                {!this.props.description ? null :
                    <div className={this.props.size === 'l' ? style['description_big'] : style['description_normal']}>
                        {this.props.description}
                    </div>
                }
                {!this.props.data ? null :
                    <div className={style['data']}>
                        {this.renderData(this.props.data)}
                    </div>
                }
            </div>
        )
    }

    renderData(data) {

        if (data.type === 'graph') {
            return this.renderStats();
        } else if (data.image) {
            return this.renderCam();
        } else if (data.temperature) {
            return this.renderThermal(data.temperature, data.humidity);
        } else if (data.buttons) {
            return this.renderButtons(data.buttons);
        } else if (data.track) {
            return <Player albumcover={data.albumcover}
                           artist={data.artist}
                           name={data.track.name}
                           length={data.track.length}
                           volume={data.volume}

            />
        } else if (data.video) {
            return <Video url={data.video}/>;
        }


    }

    renderStats() {
        return <img src='img/data/richdata.svg' alt='stats' className={style['stats']}/>;
    }

    renderCam() {
        return (
            <div className={style['']}>
                <div className={style['stats']}>
                    <img srcSet='img/data/bitmap1.png 790w,
                             img/data/bitmap2.png 1140w,
                             img/data/bitmap3.png 1490w'
                         alt='cam'
                         className={style['cam']}
                         ref={bitmap => this.bitmap = bitmap}
                         onMouseDown={(e) => e.preventDefault()}
                    />
                </div>
                {this.renderTouch()}
            </div>

        );
    }

    renderTouch() {
        if (!('ontouchstart' in window)) return null;

        return [
            <div className={style['temp_text']}>
                {`Яркость: ${this.state.contrast.toFixed(0)}%`}
            </div>,
            <div className={style['temp_text']}>
                {`Увеличение: ${this.state.zoom.toFixed(1)}x`}
            </div>,
            <div className={style['temp_text']}>
                {`Положение по горизонтале: ${this.state.positionPercentX.toFixed(0)}%`}
            </div>,
            <div className={style['temp_text']}>
                {`Положение по вертикале: ${this.state.positionPercentY.toFixed(0)}%`}
            </div>

        ]
    }

    renderButtons(buttons) {
        return (
            <div className={style['buttons']}>
                {buttons.map((text, index) =>
                    <Button active={!index} key={index} width={152} text={text}/>
                )}
            </div>
        )
    }

    renderThermal(temperature, humidity) {
        return (
            <div className={style['thermal']}>
                <div className={style['temp_line']}>
                    <div className={style['temp_text']}>
                        Температура:
                    </div>
                    <div className={style['temp_value']}>
                        {`${temperature} C`}
                    </div>
                </div>
                <div className={style['temp_line']}>
                    <div className={style['temp_text']}>
                        Влажность:
                    </div>
                    <div className={style['temp_value']}>
                        {`${humidity}%`}
                    </div>
                </div>

            </div>
        )
    }
}