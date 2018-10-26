/**
 * Created by user on 02.10.18.
 */

import React from 'react';

const style = require('./Content.scss');

interface IContentProps {
    title: string;
    className?: string;
}

export default class Content extends React.Component<IContentProps> {
    public render() {
        return (
            <div className={style['normal']}>
                <div className={style['header']}>
                    {this.props.title}
                </div>
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}