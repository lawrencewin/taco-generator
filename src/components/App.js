import React, { Component } from "react"
import { Route } from "react-router-dom"
import Home from "./Home"
import CheckForm from "./CheckForm"
import "../sass/App.scss"

export default class App extends Component {

    constructor () {
        super()
        this.state = {
            dark: false
        }
        this.toggleDarkMode = this.toggleDarkMode.bind(this)
    }

    toggleDarkMode () {
        this.setState({ dark: !this.state.dark })
    }

    render () {
        return (
            <div className={ this.state.dark ? "app dark" : "app"}> 
                <Route exact path="/" render={(props) => <Home {...props} onCheck={this.toggleDarkMode} />} />
                <Route path="/form" component={CheckForm} />
            </div>
        );
    }

}
