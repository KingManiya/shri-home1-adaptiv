/**
 * Created by user on 10.10.18.
 */

import React from 'react'
import style from '../PageEvents/PageEvents.scss';
import Content from "../Content/Content";
// import camsData from "../../../data/cams";
import Card from "../Card/Card";

export default class PageCams extends React.Component {

    state = {
        cams: [],
    };

    componentDidMount() {
        window.fetch('http://localhost:8000/api/cams')
            .then(response => response.json())
            .then(eventsData => {
                this.setState({cams: eventsData.cams})
            })
    }

    render() {
        const cams = this.state.cams.map((cam, index) => <Card {...cam} key={index}/>);

        return (
            <Content title='Камеры' className={style['normal']}>
                {cams.length ? cams : 'Загрузка...'}
            </Content>
        )
    }
}