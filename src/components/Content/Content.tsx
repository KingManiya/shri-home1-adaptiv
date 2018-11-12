/**
 * Created by user on 02.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';

import './Content.scss';

const content = cn('Content');
const contentHeader = content('Header');

interface IContentProps {
    title: string;
    className?: string;
}

export default class Content extends React.Component<IContentProps> {
    public render() {
        return (
            <div className={content()}>
                <div className={contentHeader}>
                    {this.props.title}
                </div>
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}