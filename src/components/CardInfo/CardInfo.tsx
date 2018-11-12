/**
 * Created by user on 09.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';

import './CardInfo.scss';

const cardInfo = cn('CardInfo');

interface ICardInfo {
    twoLine: boolean;
    source: string;
    time: string;
}

export default class CardInfo extends React.Component<ICardInfo> {

    public render() {
        return (
            <div className={cardInfo({two: this.props.twoLine})}>
                <div className={cardInfo('Text')}>
                    {this.props.source}
                </div>
                <div className={cardInfo('Text')}>
                    {this.props.time}
                </div>
            </div>
        );
    }
}