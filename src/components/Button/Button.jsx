/**
 * Created by user on 04.10.18.
 */

import React from 'react'
import style from './Button.scss'

export default class Button extends React.Component {
    render() {
        return (
            <div className={this.props.active ? style['active'] : style['normal']}>
                {this.props.children}
            </div>
        )
    }
}