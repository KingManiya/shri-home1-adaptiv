/**
 * Created by user on 04.10.18.
 */

import React from 'react'

const style = require('./Player.scss');

export default class Player extends React.Component {
    render() {
        return (
            <div className={style['normal']}>
                <div className={style['line_top']}>
                    <img src={this.props.albumcover} alt="album" className={style['image']}/>
                    <div className={style['top']}>
                        <div className={style['title']}>
                            {`${this.props.artist} - ${this.props.name}`}
                        </div>
                        <div className={style['song_player_line']}>
                            <div className={style['song_player']}>
                                <div className={style['song_player_value']}/>
                            </div>
                            <div className={style['info']}>
                                {`${this.props.length}`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['line_bottom']}>
                    <img src="img/player/prev.svg" alt="<<" className={style['back']}/>
                    <img src="img/player/prev.svg" alt=">>" className={style['forward']}/>
                    <div className={style['volume']}>
                        <div className={style['volume_value']}/>
                    </div>
                    <div className={style['info']}>
                        {`${this.props.volume}%`}
                    </div>
                </div>
            </div>
        )
    }
}