import React from 'react';
import {hot} from 'react-hot-loader'
import style from './App.scss'
import Header from "../Header/Header";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";

class App extends React.Component {
    render() {
        return (
            <div className={style['normal']}>
                <Header/>
                <Content events={this.props.events}/>
                <Footer/>
            </div>
        )
    }
}

export default hot(module)(App)