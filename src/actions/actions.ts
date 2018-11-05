import api from '../helpers/api';
import ICard from '../inerfaces/ICard';
import store from '../store/store';
import actionTypes from './actionsTypes';

export function eventsGetData() {
    api('events')
        .then(eventsData => {
            store.dispatch({
                type: actionTypes.EVENTS_GET_DATA,
                payload: eventsData.events,
            });
        });
}

export function camsGetData() {
    api('cams')
        .then((cams: ICard[]) => {
            store.dispatch({
                type: actionTypes.CAMS_GET_DATA,
                payload: cams,
            });
        });
}

export function changeContrast(value: number, url: string) {
    store.dispatch({
        type: actionTypes.CHANGE_CONTRAST,
        payload: value,
        url,
    });
    saveSettings(url, {contrast: value});
}

export function changeBrightness(value: number, url: string) {
    store.dispatch({
        type: actionTypes.CHANGE_BRIGHTNESS,
        payload: value,
        url,
    });
    saveSettings(url, {brightness: value});
}

function saveSettings(url: string, settings: object) {
    api('cams/settings', {
        url,
        settings,
    });
}