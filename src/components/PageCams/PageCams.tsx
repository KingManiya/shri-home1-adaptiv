/**
 * Created by user on 10.10.18.
 */

import React from 'react';
import ICard from '../../inerfaces/ICard';
import Card from '../Card/Card';
import Content from '../Content/Content';

const style = require('../PageEvents/PageEvents.scss');

interface IPageCams {
    cams: ICard[];
}

export default class PageCams extends React.Component<IPageCams> {

    public render() {
        const cams = this.props.cams.map((cam, index) => <Card {...cam} key={index}/>);

        return (
            <Content title="Камеры" className={style['normal']}>
                {cams.length ? cams : 'Загрузка...'}
            </Content>
        );
    }
}