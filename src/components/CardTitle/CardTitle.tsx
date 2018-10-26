/**
 * Created by user on 09.10.18.
 */

import React from 'react'
import style from './CardTitle.scss'
import PropTypes from "prop-types";

export default class CardTitle extends React.Component {

    static propTypes = {
        critical: PropTypes.bool.isRequired,
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className={this.props.critical ? style['critical'] : style['normal']}>
                <img src={`img/icons/${this.props.icon}.svg`} alt="" className={style['icon']}/>
                <div className={style['title']}>
                    {this.props.title}
                </div>
            </div>
        )
    }
}