/**
 * Created by user on 10.10.18.
 */

import React from 'react'
import Content from "../Content/Content";
import Card from "../Card/Card";
// import eventsData from '../../../data/events'
import style from "./PageEvents.scss";

export default class PageEvents extends React.Component {

    state = {
        events: [],
    };

    componentDidMount() {
        window.fetch('http://localhost:8000/api/events')
            .then(response => response.json())
            .then(eventsData => {
                this.setState({events: eventsData.events})
            })
    }

    render() {
        const events = this.state.events.map((event, index) => <Card {...event} key={index}/>);

        return (
            <Content title='Лента событий' className={style['normal']}>
                {events.length ? events : 'Загрузка...'}
            </Content>
        )
    }
}