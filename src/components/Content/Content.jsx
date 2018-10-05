/**
 * Created by user on 02.10.18.
 */

import React from 'react'
import style from './Content.scss'
import Card from "../Card/Card";

export default class Content extends React.Component {
    render() {
        const events = this.props.events.map((event, index) => <Card {...event} key={index}/>);

        return (
            <div className={style['normal']}>
                <div className={style['header']}>
                    Лента событий
                </div>
                {events}
            </div>
        )
    }
}