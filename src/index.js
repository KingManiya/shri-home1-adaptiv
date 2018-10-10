import App from "./components/App/App";

import ReactDOM from 'react-dom'
import React from 'react'

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');

    ReactDOM.render(
        <App/>,
        document.getElementById('root')
    )
});