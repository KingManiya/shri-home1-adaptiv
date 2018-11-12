/**
 * Created by user on 04.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';

import './AudioPlayer.scss';

const audioPlayer = cn('AudioPlayer');

interface IAudioPlayer {
    albumcover: string;
    artist: string;
    name: string;
    length: string;
    volume: number;
}

export default class AudioPlayer extends React.Component<IAudioPlayer> {
    public render() {
        return (
            <div className={audioPlayer()}>
                <div className={audioPlayer('Line', {top: true})}>
                    <img src={this.props.albumcover} alt="album" className={audioPlayer('Image')}/>
                    <div className={audioPlayer('Top')}>
                        <div className={audioPlayer('Title')}>
                            {`${this.props.artist} - ${this.props.name}`}
                        </div>
                        <div className={audioPlayer('Line', {songPlayer: true})}>
                            <div className={audioPlayer('SongPlayer')}>
                                <div className={audioPlayer('SongPlayerValue')}/>
                            </div>
                            <div className={audioPlayer('Info')}>
                                {`${this.props.length}`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={audioPlayer('Line', {bottom: true})}>
                    <img src="img/player/prev.svg" alt="<<" className={audioPlayer('Control')}/>
                    <img src="img/player/prev.svg" alt=">>" className={audioPlayer('Control', {forward: true})}/>
                    <div className={audioPlayer('Volume')}>
                        <div className={audioPlayer('VolumeValue')}/>
                    </div>
                    <div className={audioPlayer('Info')}>
                        {`${this.props.volume}%`}
                    </div>
                </div>
            </div>
        );
    }
}