import Store from 'shrilux';
import IState from '../inerfaces/IState';
import reducer from '../reducers/reducer';

const initialState: IState = {
    events: [],
    cams: [],
};

const store = new Store(reducer, initialState);

export default store;