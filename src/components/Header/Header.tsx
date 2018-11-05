/**
 * Created by user on 02.10.18.
 */

import React from 'react';
import {NavLink} from 'react-router-dom';

const style = require('./Header.scss');

export default class Header extends React.Component {
    public state = {
        menuActive: false,
    };

    public render() {
        return (
            <div className={this.state.menuActive ? style['menu_active'] : style['normal']}>
                <a className={style['logo']} href="#"/>
                <div className={style['links']}>
                    <NavLink to="/" className={style['link']} exact
                             activeClassName={style['link_active']}
                    >
                        События
                    </NavLink>
                    <NavLink to="/info" className={style['link']}
                             activeClassName={style['link_active']}
                    >
                        Сводка
                    </NavLink>
                    <NavLink to="/devices" className={style['link']}
                             activeClassName={style['link_active']}
                    >
                        Устройства
                    </NavLink>
                    {/*<NavLink to="/scenarios" className={style['link']}*/}
                    {/*activeClassName={style['link_active']}*/}
                    {/*>*/}
                    {/*Сценарии*/}
                    {/*</NavLink>*/}
                    <NavLink to="/cams" className={style['link']}
                             activeClassName={style['link_active']}
                    >
                        Камеры
                    </NavLink>
                </div>
                <div className={style['menu']}
                     onClick={() => this.setState({menuActive: !this.state.menuActive})}
                />
            </div>
        );
    }
}