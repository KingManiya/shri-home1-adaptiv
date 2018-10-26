/**
 * Created by user on 09.10.18.
 */

import React from 'react';

const style = require('./CardTitle.scss');

interface ICardTitle {
    critical: boolean;
    icon: string;
    title: string;
}

export default class CardTitle extends React.Component<ICardTitle> {

    public render() {
        return (
            <div className={this.props.critical ? style['critical'] : style['normal']}>
                <img src={`img/icons/${this.props.icon}.svg`} alt="" className={style['icon']}/>
                <div className={style['title']}>
                    {this.props.title}
                </div>
            </div>
        );
    }
}