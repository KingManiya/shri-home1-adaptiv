/**
 * Created by user on 10.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';
import ICard from '../../inerfaces/ICard';
import Card from '../Card/Card';
import Content from '../Content/Content';

import './PageEvents.scss';

const pageEvent = cn('PageEvents');

interface IPageEvents {
    events: ICard[];
}

export default class PageEvents extends React.Component<IPageEvents> {

    public render() {
        const events = this.props.events.map((event, index) => <Card {...event} key={index}/>);

        return (
            <Content title="Лента событий" className={pageEvent()}>
                {events.length ? events : 'Загрузка...'}
            </Content>
        );
    }
}