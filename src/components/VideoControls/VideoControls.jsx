/**
 * Created by user on 14.10.18.
 */

import React from 'react'
import style from './VideoControls.scss'
import PropTypes from 'prop-types'
import BarDiagram from "../BarDiagram/BarDiagram";

export default class VideoControls extends React.Component {

    static propTypes = {
        brightness: PropTypes.number.isRequired,
        onUpdateBrightness: PropTypes.func.isRequired,
        contrast: PropTypes.number.isRequired,
        onUpdateContrast: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        analyser: PropTypes.object.isRequired,
    };

    state = {
        show: true,
    };

    render() {

        return (
            <div className={style['normal']}>
                {!this.state.show ? null : [
                    <div className={style['line']} key={1}>
                        <div className={style['text']}>
                            Контрастность
                        </div>
                        <input type='range' min={0} max={2} step={0.05}
                               onChange={event => this.props.onUpdateContrast(event.target.value)}
                               value={this.props.contrast}
                        />
                    </div>
                    ,
                    <div className={style['line']} key={2}>
                        <div className={style['text']}>
                            Яркость
                        </div>
                        <input type='range' min={0} max={2} step={0.05}
                               onChange={event => this.props.onUpdateBrightness(event.target.value)}
                               value={this.props.brightness}
                        />
                    </div>
                    ,
                    <BarDiagram analyser={this.props.analyser} key={3}/>
                ]}
                <div className={style['line']}>
                    <div className={style['button']}
                         onClick={e => {
                             e.stopPropagation();
                             this.setState({show: !this.state.show});
                         }}
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