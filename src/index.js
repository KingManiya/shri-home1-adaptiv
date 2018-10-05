import App from "./components/App/App";

import ReactDOM from 'react-dom'
import React from 'react'
import eventsData from './events'

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');

    ReactDOM.render(
        <App events={eventsData.events}/>,
        document.getElementById('root')
    )
});