/**
 * Created by user on 01/11/2018.
 */

import React from 'react';
import PageEvents from '../../components/PageEvents/PageEvents';

export default class PageEventsContainer extends React.Component {
    public state = {
        events: [],
    };

    public componentDidMount() {
        window.fetch('http://localhost:8000/api/events')
            .then(response => response.json())
            .then(eventsData => {
                this.setState({events: eventsData.events});
            });
    }

    public render() {
        return <PageEvents events={this.state.events}/>;
    }
}