/**
 * Created by user on 02.10.18.
 */

import {cn} from '@bem-react/classname';
import React from 'react';
import {NavLink} from 'react-router-dom';

import './Header.scss';

const header = cn('Header');
const headerLink = cn(header(), 'Link');
// Для react-router это вызывает дублирование класса Header-Link, но по другому не выходит для NavLink.
const headerLinkActive = headerLink({active: true});

export default class Header extends React.Component {
    public state = {
        menuActive: false,
    };

    public render() {
        return (
            <div className={header({menuActive: this.state.menuActive})}>
                <a className={header('Logo')} href="#"/>
                <div className={header('Links')}>
                    <NavLink to="/" className={headerLink()} exact
                             activeClassName={headerLinkActive}
                    >
                        События
                    </NavLink>
                    <NavLink to="/info" className={headerLink()} exact
                             activeClassName={headerLinkActive}
                    >
                        Сводка
                    </NavLink>
                    <NavLink to="/devices" className={headerLink()} exact
                             activeClassName={headerLinkActive}
                    >
                        Устройства
                    </NavLink>
                    <NavLink to="/cams" className={headerLink()} exact
                             activeClassName={headerLinkActive}
                    >
                        Камеры
                    </NavLink>
                </div>
                <div className={header('Menu')}
                     onClick={() => this.setState({menuActive: !this.state.menuActive})}
                />
            </div>
        );
    }
}