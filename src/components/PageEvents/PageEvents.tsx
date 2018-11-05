/**
 * Created by user on 10.10.18.
 */

import React from 'react';
import Card from '../Card/Card';
import Content from '../Content/Content';

const style = require('./PageEvents.scss');

export default class PageEvents extends React.Component {

    public state = {
        events: [],
    };

    public componentDidMount() {
        window.fetch('http://localhost:8000/api/events')
            .then(response => response.json())
            .then(eventsData => {
                this.setState({events: eventsData.events});
            });
    }

    public render() {
        const events = this.state.events.map((event, index) => <Card {...event} key={index}/>);

        return (
            <Content title="Лента событий" className={style['normal']}>
                {events.length ? events : 'Загрузка...'}
            </Content>
        );
    }
}