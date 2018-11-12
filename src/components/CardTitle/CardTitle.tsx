/**
 * Created by user on 09.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';

import './CardTitle.scss';

const cardTitle = cn('CardTitle');

interface ICardTitle {
    critical: boolean;
    icon: string;
    title: string;
}

export default class CardTitle extends React.Component<ICardTitle> {

    public render() {
        return (
            <div className={cardTitle({critical: this.props.critical})}>
                <img src={`img/icons/${this.props.icon}.svg`} alt="" className={cardTitle('Icon')}/>
                <div className={cardTitle('Text')}>
                    {this.props.title}
                </div>
            </div>
        );
    }
}