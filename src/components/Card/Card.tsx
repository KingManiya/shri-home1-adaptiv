/**
 * Created by user on 02.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';
import ICard from '../../inerfaces/ICard';
import CardData from '../CardData/CardData';
import CardInfo from '../CardInfo/CardInfo';
import CardTitle from '../CardTitle/CardTitle';

import './Card.scss';

const card = cn('Card');

export default class Card extends React.Component<ICard> {

    public render() {
        const className = card({
            small: this.props.size === 's',
            medium: this.props.size === 'm',
            large: this.props.size === 'l',
            critical: this.props.type === 'critical',
        });

        return (
            <div className={className}>
                <div className={card('Action', {cross: true})}/>
                <div className={card('Action', {next: true})}/>
                {this.renderMain()}
                {this.renderContent()}
            </div>
        );
    }

    private renderMain() {
        const critical = this.props.type === 'critical';

        return (
            <div className={card('Header')}>
                <CardTitle critical={critical} title={this.props.title} icon={this.props.icon}/>
                <CardInfo twoLine={this.props.size === 's'} source={this.props.source} time={this.props.time}/>
            </div>
        );
    }

    private renderContent() {
        return (
            <div className={card('Content')}>
                {!this.props.description ? null :
                    <div className={card('Description', {big: this.props.size === 'l'})}>
                        {this.props.description}
                    </div>
                }
                {!this.props.data ? null :
                    <div className={card('Data')}>
                        <CardData data={this.props.data}/>
                    </div>
                }
            </div>
        );
    }
}