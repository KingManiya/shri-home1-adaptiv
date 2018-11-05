/**
 * Created by user on 01/11/2018.
 */

import React from 'react';
import {camsGetData} from '../../actions/actions';
import PageCams from '../../components/PageCams/PageCams';
import ICard from '../../inerfaces/ICard';
import IState from '../../inerfaces/IState';
import store from '../../store/store';

interface IPageCamsContainerState {
    cams: ICard[];
}

export default class PageCamsContainer extends React.Component<{}, IPageCamsContainerState> {
    public state: IPageCamsContainerState = {
        cams: [],
    };

    public componentDidMount() {
        store.subscribe(this.subscribe);

        camsGetData();
    }

    public componentWillUnmount() {
        store.unsubscribe(this.subscribe);
    }

    public render() {
        return <PageCams cams={this.state.cams}/>;
    }

    private subscribe = () => {
        const state: IState = store.getState();
        const cams = state.cams;
        this.setState({cams});
    }
}