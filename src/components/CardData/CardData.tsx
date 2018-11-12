/**
 * Created by user on 09.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';
import {
    changePoint,
    deletePoint,
    registerMove,
    registerPoint,
    registerRotate,
    registerScale,
} from '../../helpers/gestures';
import ICardData from '../../inerfaces/ICardData';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import Button from '../Button/Button';
import Video from '../Video/Video';

import './CardData.scss';

const cardData = cn('CardData');

interface ICardDataProps {
    data: ICardData;
}

export default class CardData extends React.Component<ICardDataProps> {

    public state = {
        zoom: 2,
        positionPercentX: 50,
        positionPercentY: 50,
        contrast: 100,
    };

    private bitmap: HTMLImageElement | null = null;

    public componentDidMount() {
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

            registerRotate((speed: number) => {
                if (!this.bitmap) return;

                contrast += speed;
                if (contrast < 0) contrast = 0;
                if (contrast > 300) contrast = 300;
                this.bitmap.style.filter = `brightness(${contrast}%)`;
                this.setState({contrast});
            });

            registerMove((speedX: number, speedY: number) => {
                if (!this.bitmap) return;

                imageX += speedX / zoom;
                imageY += speedY / zoom;

                /*
                * zoom - отступ. 320 - половина от ширины в 640
                * 1-0   (320*0/1)
                * 2-160 (320*1/2)
                * 3-213 (320*2/3)
                * 4-240 (320*3/4)
                * */

                // Установка ограничения по тасканию картинки
                const width = this.bitmap.width;
                const height = this.bitmap.height;
                const x = width / 2 * (zoom - 1) / zoom;
                const y = height / 2 * (zoom - 1) / zoom;
                if (imageX >= x) imageX = x;
                if (imageY >= y) imageY = y;
                if (imageX <= -x) imageX = -x;
                if (imageY <= -y) imageY = -y;

                this.changeCamZoom(zoom, imageX, imageY);
                const positionPercentX = x ? (x - imageX) / (x * 2) * 100 : 100;
                const positionPercentY = y ? (y - imageY) / (y * 2) * 100 : 100;

                this.setState({positionPercentX, positionPercentY, zoom});
            });

            registerScale((speed: number) => {
                zoom = tempZoom * speed;
                if (zoom < 1) zoom = 1;
                if (zoom > 10) zoom = 10;
                this.changeCamZoom(zoom, imageX, imageY);
            }, () => tempZoom = zoom);
        }
    }

    private changeCamZoom(zoom: number, positionX: number, positionY: number) {
        if (this.bitmap) {
            this.bitmap.style.transform = `scale(${zoom}) translateX(${positionX}px) translateY(${positionY}px)`;
        }
    }

    public render() {

        const data = this.props.data;

        if (data.type === 'graph') {
            return this.renderStats();
        } else if (data.image) {
            return this.renderCam();
        } else if (data.temperature) {
            return this.renderThermal(data.temperature, data.humidity);
        } else if (data.buttons) {
            return this.renderButtons(data.buttons);
        } else if (data.track) {
            return <AudioPlayer albumcover={data.albumcover}
                                artist={data.artist}
                                name={data.track.name}
                                length={data.track.length}
                                volume={data.volume}

            />;
        } else if (data.video) {
                    return <Video url={data.video}
                                  brightness={data.brightness}
                                  contrast={data.contrast}
                    />;
        }
        return null;
    }

    private renderStats() {
        return <img src="img/data/richdata.svg" alt="stats" className={cardData('Stats')}/>;
    }

    private renderCam() {
        return (
            <div className={''}>
                <div className={cardData('Stats')}>
                    <img srcSet="img/data/bitmap1.png 790w,
                                 img/data/bitmap2.png 1140w,
                                 img/data/bitmap3.png 1490w"
                         alt="cam"
                         className={cardData('Cam')}
                         ref={bitmap => this.bitmap = bitmap}
                         onMouseDown={(e) => e.preventDefault()}
                    />
                </div>
                {this.renderTouch()}
            </div>

        );
    }

    private renderTouch() {
        if (!('ontouchstart' in window)) return null;

        const tempText = cardData('TempText');

        return [
            <div className={tempText}>
                {`Яркость: ${this.state.contrast.toFixed(0)}%`}
            </div>,
            <div className={tempText}>
                {`Увеличение: ${this.state.zoom.toFixed(1)}x`}
            </div>,
            <div className={tempText}>
                {`Положение по горизонтале: ${this.state.positionPercentX.toFixed(0)}%`}
            </div>,
            <div className={tempText}>
                {`Положение по вертикале: ${this.state.positionPercentY.toFixed(0)}%`}
            </div>,

        ];
    }

    private renderButtons(buttons: []) {
        return (
            <div className={cardData('Buttons')}>
                {buttons.map((text, index) =>
                    <Button active={!index} key={index} width={152} text={text}/>,
                )}
            </div>
        );
    }

    private renderThermal(temperature: number, humidity: number) {
        const tempLine = cardData('TempLine');
        const tempText = cardData('TempText');
        const tempTextValue = cardData('TempText', {value: true});

        return (
            <div className={cardData('Thermal')}>
                <div className={tempLine}>
                    <div className={tempText}>
                        Температура:
                    </div>
                    <div className={tempTextValue}>
                        {`${temperature} C`}
                    </div>
                </div>
                <div className={tempLine}>
                    <div className={tempText}>
                        Влажность:
                    </div>
                    <div className={tempTextValue}>
                        {`${humidity}%`}
                    </div>
                </div>

            </div>
        );
    }
}