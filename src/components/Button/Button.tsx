/**
 * Created by user on 04.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';

import './Button.scss';

const button = cn('Button');

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
            <div className={button({active: this.props.active})}
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