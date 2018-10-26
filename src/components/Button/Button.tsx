/**
 * Created by user on 04.10.18.
 */

import React from 'react'
import style from './Button.scss'
import PropTypes from 'prop-types'

export default class Button extends React.Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        active: PropTypes.bool,
        onClick: PropTypes.func,

        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        margin: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    };

    render() {
        return (
            <div className={this.props.active ? style['active'] : style['normal']}
                 onClick={this.props.onClick ? this.props.onClick : null}
                 style={{
                     width: this.props.width,
                     margin: this.props.margin,
                 }}
            >
                {this.props.text}
            </div>
        )
    }
}