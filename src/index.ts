import App from './components/App/App';

import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');

    ReactDOM.render(
        React.createElement(App),
        document.getElementById('root'),
    );
});