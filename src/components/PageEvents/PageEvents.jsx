/**
 * Created by user on 10.10.18.
 */

import React from 'react'
import Content from "../Content/Content";
import Card from "../Card/Card";
import eventsData from '../../events'
import style from "./PageEvents.scss";

export default class PageEvents extends React.Component {
    render() {
        const events = eventsData.events.map((event, index) => <Card {...event} key={index}/>);
        return (
            <Content title='Лента событий' className={style['normal']}>
                {events}
            </Content>
        )
    }
}