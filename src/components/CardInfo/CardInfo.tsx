/**
 * Created by user on 09.10.18.
 */

import React from 'react'
import PropTypes from "prop-types";

const style = require('./CardInfo.scss');

export default class CardInfo extends React.Component {

    static propTypes = {
        twoLine: PropTypes.bool.isRequired,
        source: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className={this.props.twoLine ? style['two'] : style['normal']}>
                <div className={style['text']}>
                    {this.props.source}
                </div>
                <div className={style['text']}>
                    {this.props.time}
                </div>
            </div>
        )
    }
}