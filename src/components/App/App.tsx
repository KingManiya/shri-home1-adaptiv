import React from 'react';
import {hot} from 'react-hot-loader';
import {HashRouter as Router, Route} from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PageCams from '../PageCams/PageCams';
import PageDev from '../PageDev/PageDev';
import PageEvents from '../PageEvents/PageEvents';

const style = require('./App.scss');

class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className={style['normal']}>
                    <Header/>
                    <Route path="/" component={PageEvents} exact/>
                    <Route path="/info" component={PageDev}/>
                    <Route path="/devices" component={PageDev}/>
                    {/*<Route path="/scenarios" component={PageDev}/>*/}
                    <Route path="/cams" component={PageCams}/>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default hot(module)(App);