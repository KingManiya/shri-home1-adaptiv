/**
 * Created by user on 04.10.18.
 */

import React from 'react';

const style = require('./Button.scss');

interface IButton {
    text: string;
    active?: boolean;
    onClick?: ((e: React.MouseEvent) => void);
    width?: string | number;
    margin?: string | number;
}

export default class Button extends React.Component<IButton> {

    public render() {
        return (
            <div className={this.props.active ? style['active'] : style['normal']}
                 onClick={this.props.onClick}
                 style={{
                     width: this.props.width,
                     margin: this.props.margin,
                 }}
            >
                {this.props.text}
            </div>
        );
    }
}