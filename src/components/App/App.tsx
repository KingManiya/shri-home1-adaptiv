import {cn} from '@bem-react/classname';
import React from 'react';
import {hot} from 'react-hot-loader';
import {HashRouter as Router, Route} from 'react-router-dom';
import PageCamsContainer from '../../containers/PageCamsContainer/PageCamsContainer';
import PageEventsContainer from '../../containers/PageEventsContainer/PageEventsContainer';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PageDev from '../PageDev/PageDev';

import './App.scss';

const app = cn('App');

class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className={app()}>
                    <Header/>
                    <Route path="/" component={PageEventsContainer} exact/>
                    <Route path="/info" component={PageDev}/>
                    <Route path="/devices" component={PageDev}/>
                    <Route path="/cams" component={PageCamsContainer}/>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default hot(module)(App);