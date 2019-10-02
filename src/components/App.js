import React, { Component } from "react"
import { Route } from "react-router-dom"
import Home from "./Home"
import CheckForm from "./CheckForm"
import "../sass/App.scss"

export default class App extends Component {

    constructor () {
        super()
        this.state = {
            tacos: [],
            dark: false
        }
        this.saveTacos = this.saveTacos.bind(this)
        this.toggleDarkMode = this.toggleDarkMode.bind(this)
    }

    saveTacos (tacos) {
        this.setState({ tacos: tacos })
    }

    toggleDarkMode () {
        this.setState({ dark: !this.state.dark })
    }

    render () {
        return (
            <div className={ this.state.dark ? "app dark" : "app"}>
                <Route exact path="/" render={(props) => {
                    return <Home
                        {...props}
                        onCheck={this.toggleDarkMode}
                        onSave={this.saveTacos}
                        tacos={this.state.tacos}
                    />}} />
                <Route path="/form" component={CheckForm} />
            </div>
        );
    }

}
