/**
 * Created by user on 10.10.18.
 */

import React from 'react'
import style from '../PageEvents/PageEvents.scss';
import Content from "../Content/Content";
import camsData from "../../../data/cams";
import Card from "../Card/Card";

export default class PageCams extends React.Component {

    render() {
        const cams = camsData.cams.map((cam, index) => <Card {...cam} key={index}/>);

        return (
            <Content title='Камеры' className={style['normal']}>
                {cams}
            </Content>
        )
    }
}