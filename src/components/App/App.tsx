import React from 'react';
import {hot} from 'react-hot-loader';
import {HashRouter as Router, Route} from 'react-router-dom';
import PageCamsContainer from '../../containers/PageCamsContainer/PageCamsContainer';
import PageEventsContainer from '../../containers/PageEventsContainer/PageEventsContainer';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PageDev from '../PageDev/PageDev';

const style = require('./App.scss');

class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className={style['normal']}>
                    <Header/>
                    <Route path="/" component={PageEventsContainer} exact/>
                    <Route path="/info" component={PageDev}/>
                    <Route path="/devices" component={PageDev}/>
                    {/*<Route path="/scenarios" component={PageDev}/>*/}
                    <Route path="/cams" component={PageCamsContainer}/>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default hot(module)(App);