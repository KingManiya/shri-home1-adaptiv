/**
 * Created by user on 02.10.18.
 */

import React from 'react'
import style from './Header.scss'

export default class Header extends React.Component {
    state = {
        menuActive: false,
    };

    render() {
        return (
            <div className={this.state.menuActive ? style['menu_active'] : style['normal']}>
                <a className={style['logo']} href='#'/>
                <div className={style['links']}>
                    <a className={style['link_active']} href='#'>
                        События
                    </a>
                    <a className={style['link']} href='#'>
                        Сводка
                    </a>
                    <a className={style['link']} href='#'>
                        Устройства
                    </a>
                    <a className={style['link']} href='#'>
                        Сценарии
                    </a>
                </div>
                <div className={style['menu']}
                     onClick={() => this.setState({menuActive: !this.state.menuActive})}
                />
            </div>
        )
    }
}