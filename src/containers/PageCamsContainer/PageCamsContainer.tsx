/**
 * Created by user on 01/11/2018.
 */

import React from 'react';
import PageCams from '../../components/PageCams/PageCams';

export default class PageCamsContainer extends React.Component {
    public state = {
        cams: [],
    };

    public componentDidMount() {
        window.fetch('http://localhost:8000/api/cams')
            .then(response => response.json())
            .then(eventsData => {
                this.setState({cams: eventsData.cams});
            });
    }

    public render() {
        return <PageCams cams={this.state.cams}/>;
    }
}