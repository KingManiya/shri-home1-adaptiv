/**
 * Created by user on 10.10.18.
 */

import React from 'react';
import ICard from '../../inerfaces/ICard';
import Card from '../Card/Card';
import Content from '../Content/Content';

const style = require('./PageEvents.scss');

interface IPageEvents {
    events: ICard[];
}

export default class PageEvents extends React.Component<IPageEvents> {

    public render() {
        const events = this.props.events.map((event, index) => <Card {...event} key={index}/>);

        return (
            <Content title="Лента событий" className={style['normal']}>
                {events.length ? events : 'Загрузка...'}
            </Content>
        );
    }
}