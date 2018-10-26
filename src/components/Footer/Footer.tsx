/**
 * Created by user on 02.10.18.
 */

import React from 'react';

const style = require('./Footer.scss');

export default class Footer extends React.Component {
    public render() {
        return (
            <div className={style['normal']}>
                <a href="#" className={style['link']}>
                    Помощь
                </a>
                <a href="#" className={style['link']}>
                    Обратная связь
                </a>
                <a href="#" className={style['link']}>
                    Разработчикам
                </a>
                <a href="#" className={style['link']}>
                    Условия использования
                </a>
                <a href="license.pdf" className={style['link']}>
                    Авторские права
                </a>
                <div className={style['link']}>
                    © 2001–2018 ООО «Яндекс»
                </div>
            </div>
        );
    }
}