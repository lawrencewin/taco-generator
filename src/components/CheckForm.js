import React, { Component } from "react"
import {SquareLoader} from "react-spinners"
import { Redirect, Link} from "react-router-dom"
import "../sass/CheckForm.scss"

const API_URL = "https://ct-tacoapi.azurewebsites.net"

// Useful variables
const options = {
    shells: "Shells",
    baseLayers: "Base Layers",
    mixins: "Mixins",
    condiments: "Condiments",
    seasonings: "Seasonings"
}

const SECTIONS = []
const MAX_SELECTED = {
    shells: 1,
    baseLayers: 2,
    mixins: 2,
    condiments: 3,
    seasonings: 1
}

export default class CheckForm extends Component {

    constructor () {
        super()
        this.state = {
            formSections: SECTIONS.length > 0 ? SECTIONS : [],
            selected: {
                shells: [],
                baseLayers: [],
                mixins: [],
                condiments: [],
                seasonings: [],
                isTaco: true
            },
            loading: true,
            error: undefined,
            submitted: false
        }
        this.handleSelect = this.handleSelect.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount () {
        this.getOptions()
    }

    // Calls the API to get our choices of ingredients for each given category and saves it to use later
    async getOptions () {
        if (SECTIONS.length === 0) {
            const endpoints = Object.keys(options)
            for (const endpoint of endpoints) {
                const response = await fetch(`${API_URL}/${endpoint}`)
                const choices = await response.json()
                // Strip names of parenthesis to make ingredient more readable
                for (const choice of Object.keys(choices)) {
                    let name = choices[choice].name
                    if (name.includes("\(")) {
                        choices[choice].name = name.replace(/ *\([^)]*\) */g, "")
                    }
                }
                SECTIONS.push({
                    title: options[endpoint],
                    type: endpoint,
                    choices: choices
                })
            }
        }
        this.setState({ loading: false, formSections: SECTIONS })
    }

    // On submission, check whether the user filled in at least one choice for each ingredient category and pushes the taco configuration
    // object (selected ingredients) onto the history stack, updating the components state to redirect to the root route on the next render
    handleSubmit (e) {
        e.preventDefault()
        const selected = this.state.selected
        let unfilled = []
        for (const option of Object.keys(options)) {
            if (selected[option].length === 0) {
                unfilled.push(options[option])
            }
        }
        // Check if everything has been filled
        if (unfilled.length > 0) {
            let errorString = "Please fill out all options. You've missed the following categories: "
            errorString += unfilled.reduce((sum, missed, i) => {
                if (i === 0) { return `${missed}` }
                return `${sum}, ${missed}`
            })
            this.setState({ error: errorString })
            return
        }
        this.setState({ submitted: true })
    }

    // With checkboxes being controlled input, updates state of checkboxes, adds selected ingredient to saved list of selected ingredients,
    // and removes the oldest ingredient in the category if the max selected has been exceeded
    handleSelect (e) {
        const name = e.target.name, value = e.target.value, checked = e.target.checked
        this.setState((prevState) => {
            const prevSelected = prevState.selected, option = prevSelected[name]
            let updated
            if (checked) {
                // Remove oldest element added
                if (option.length + 1 > MAX_SELECTED[name])
                    option.shift()
                updated = option.concat([value])
            } else {
                updated = option.filter(item => item !== value)
            }
            return {
                ...prevState,
                selected: {
                    ...prevSelected,
                    [name]: updated
                }
            }
        })
    }

    render () {
        const { formSections, selected, loading, error, submitted } = this.state
        if (submitted)
            return <Redirect
            to={{
                pathname: "/",
                state: selected
            }}
        />
        return loading ?
        (
            <div className="body">
                <SquareLoader
                    size={5}
                    sizeUnit={"rem"}
                    color={"#FFB011"}
                    loading={true}
                    className="loader"
                />
                <p>Getting the ingredients...</p>
            </div>
        ) : (
            <div className="body">
                <Link to="/">Back to home</Link>
                <h2>Build your Taco</h2>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    { formSections.map((section, i) => {
                        return (
                            <section key={i}>
                                <h4 className="acc2">{section.title}</h4>
                                <p>Can pick up to {MAX_SELECTED[section.type]} items</p>
                                {
                                    section.choices.map((choice, i) => {
                                        return (
                                            <div className="checkGroup" key={i} >
                                                <input
                                                    type="checkbox"
                                                    name={section.type}
                                                    value={choice.name}
                                                    id={choice.slug}
                                                    onChange={this.handleSelect}
                                                    checked={selected[section.type].includes(choice.name) ? "checked" : "" }
                                                />
                                                <label htmlFor={choice.slug} >{choice.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </section>
                        )
                    }) }
                    { error !== undefined ? <div className="error">{error}</div> : "" }
                    <input type="submit" value="Create a taco!" />
                </form>
            </div>
        )
    }

}
