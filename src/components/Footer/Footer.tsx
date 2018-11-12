/**
 * Created by user on 02.10.18.
 */

import React from 'react';

import {cn} from '@bem-react/classname';
import './Footer.scss';

const footer = cn('Footer');
const footerLink = footer('Link');

export default class Footer extends React.Component {
    public render() {
        return (
            <div className={footer()}>
                <a href="#" className={footerLink}>
                    Помощь
                </a>
                <a href="#" className={footerLink}>
                    Обратная связь
                </a>
                <a href="#" className={footerLink}>
                    Разработчикам
                </a>
                <a href="#" className={footerLink}>
                    Условия использования
                </a>
                <a href="license.pdf" className={footerLink}>
                    Авторские права
                </a>
                <div className={footerLink}>
                    © 2001–2018 ООО «Яндекс»
                </div>
            </div>
        );
    }
}