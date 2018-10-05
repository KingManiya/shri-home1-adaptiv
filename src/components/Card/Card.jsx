/**
 * Created by user on 02.10.18.
 */

import React from 'react'
import style from './Card.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Player from "../Player/Player";
import Button from "../Button/Button";

export default class Card extends React.Component {
    static propTypes = {
        // small: PropTypes.bool,
        // medium: PropTypes.bool,
        // large: PropTypes.bool,
    };

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
        return (
            <div className={style['header']}>
                <div className={style['header_line']}>
                    <img src={`img/icons/${this.props.icon}.svg`} alt="" className={style['header_icon']}/>
                    <div className={style['header_title']}>
                        {this.props.title}
                    </div>
                </div>
                <div className={this.props.size === 's' ? style['header_info2'] : style['header_info']}>
                    <div className={style['header_info_text']}>
                        {this.props.source}
                    </div>
                    <div className={style['header_info_text']}>
                        {this.props.time}
                    </div>
                </div>
            </div>
        )
    }

    renderContent() {
        if (this.props.description) {
            return (
                <div className={style['content']}>
                    <div className={this.props.size === 'l' ? style['description_big'] : style['description_normal']}>
                        {this.props.description}
                    </div>
                    {!this.props.data ? null :
                        <div className={style['data']}>
                            {this.renderData(this.props.icon, this.props.data)}
                        </div>
                    }
                </div>
            )
        }
    }

    renderData(type, data) {

        switch (type) {
            case 'stats':
                return this.renderStats();
            case 'cam':
                return this.renderCam();
            case 'thermal':
                return this.renderThermal(data.temperature, data.humidity);
            case 'fridge':
                return this.renderButtons(data.buttons);
            case 'music':
                return <Player albumcover={data.albumcover}
                               artist={data.artist}
                               name={data.track.name}
                               length={data.track.length}
                               volume={data.volume}

                />
        }


    }

    renderStats() {
        return <img src='img/data/richdata.svg' alt='stats' className={style['cam']}/>;
    }

    renderCam() {
        return <img srcSet='img/data/bitmap1.png 790w,
                             img/data/bitmap2.png 1140w,
                             img/data/bitmap3.png 1490w'
                    alt='cam'
                    className={style['cam']}
        />;
    }

    renderButtons(buttons) {
        return (
            <div className={style['buttons']}>
                {buttons.map((text, index) =>
                    <Button active={!index} key={index}>
                        {text}
                    </Button>
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