import actionsTypes from '../actions/actionsTypes';
import IAction from '../inerfaces/IAction';
import ICard from '../inerfaces/ICard';
import IState from '../inerfaces/IState';

export default function reducer(state: IState, action: IAction) {
    let cams: ICard[];

    switch (action.type) {
        case actionsTypes.EVENTS_GET_DATA:
            return {...state, events: action.payload};
        case actionsTypes.CAMS_GET_DATA:
            return {...state, cams: action.payload};
        case actionsTypes.CHANGE_BRIGHTNESS:
            cams = state.cams;
            cams.forEach(cam => {
                if (cam.data && cam.data.video === action.url) cam.data.brightness = action.payload;
            });
            return {...state};
        case actionsTypes.CHANGE_CONTRAST:
            cams = state.cams;
            cams.forEach(cam => {
                if (cam.data && cam.data.video === action.url) cam.data.contrast = action.payload;
            });
            return {...state};
    }
    return state;
}