/**
 * Created by user on 01/11/2018.
 */

import React from 'react';
import {eventsGetData} from '../../actions/actions';
import PageEvents from '../../components/PageEvents/PageEvents';
import ICard from '../../inerfaces/ICard';
import IState from '../../inerfaces/IState';
import store from '../../store/store';

interface IPageEventsContainerState {
    events: ICard[];
}

export default class PageEventsContainer extends React.Component<{}, IPageEventsContainerState> {
    public state: IPageEventsContainerState = {
        events: [],
    };

    public componentDidMount() {
        store.subscribe(this.subscribe);

        eventsGetData();
    }

    public componentWillUnmount() {
        store.unsubscribe(this.subscribe);
    }

    public render() {
        return <PageEvents events={this.state.events}/>;
    }

    private subscribe = () => {
        const state: IState = store.getState();
        const events = state.events;
        this.setState({events});
    }
}