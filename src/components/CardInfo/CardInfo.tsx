/**
 * Created by user on 09.10.18.
 */

import React from 'react';

const style = require('./CardInfo.scss');

interface ICardInfo {
    twoLine: boolean;
    source: string;
    time: string;
}

export default class CardInfo extends React.Component<ICardInfo> {

    public render() {
        return (
            <div className={this.props.twoLine ? style['two'] : style['normal']}>
                <div className={style['text']}>
                    {this.props.source}
                </div>
                <div className={style['text']}>
                    {this.props.time}
                </div>
            </div>
        )
    }
}