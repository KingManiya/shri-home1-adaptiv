import React from 'react';
import {hot} from 'react-hot-loader'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {HashRouter as Router, Route} from "react-router-dom";
// import PageEvents from "../PageEvents/PageEvents";
// import PageCams from "../PageCams/PageCams";
import PageDev from "../PageDev/PageDev";

const style = require('./App.scss');

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className={style['normal']}>
                    <Header/>
                    {/*<Route path='/' component={PageEvents} exact/>*/}
                    <Route path='/info' component={PageDev}/>
                    <Route path='/devices' component={PageDev}/>
                    {/*<Route path='/scenarios' component={PageDev}/>*/}
                    {/*<Route path='/cams' component={PageCams}/>*/}
                    <Footer/>
                </div>
            </Router>
        )
    }
}

export default hot(module)(App)