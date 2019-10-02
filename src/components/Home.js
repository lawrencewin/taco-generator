import React, { Component } from "react"
import { Link } from "react-router-dom"
import Taco, { randomTacoConfig } from "./misc/Taco"
import Cookies from "js-cookie"
import "../sass/Home.scss"

const COOKIE_KEY = "tacos"

export default class Home extends Component {

    constructor (props) {
        super(props)
        // Set cookie if it doesn't exist
        let savedTacos = Cookies.getJSON(COOKIE_KEY) || this.props.tacos
        if (savedTacos === undefined) {
            Cookies.set(COOKIE_KEY, [], { expires: 365, path: "" })
            savedTacos = []
        }
        this.state = {
            tacos: savedTacos
        }
        this.saveTaco = this.saveTaco.bind(this)
        this.deleteAllTacos = this.deleteAllTacos.bind(this)
        this.getRandomTaco = this.getRandomTaco.bind(this)
        this.saveTacoTitle = this.saveTacoTitle.bind(this)
        this.handleCheckToggle = this.handleCheckToggle.bind(this)
    }

    // On each load of this route, check whether a taco config was passed through the history stack. If so, save it
    componentDidMount () {
        // Get stuff off of the history stack
        const config = this.props.location.state
        if ((config !== null && config !== undefined) && config.isTaco) {
            // Update saved tacos
            this.saveTaco(config, true)
        }
        console.log(this.props.history)
    }

    // Given a configuration of a taco, containing baseLayer, mixins, etc., save it to our state array and locally in our cookie
    saveTaco (config, cameFromHistory = false) {
        // Update saved tacos
        const newTacos = this.state.tacos.concat([new Taco(config)])
        this.setState({ tacos: newTacos })
        // On github pages cookies don't work!!!
        Cookies.set(COOKIE_KEY, newTacos)
        this.props.onSave(newTacos)
        this.props.onSave(newTacos)
        if (cameFromHistory === true)
            this.props.history.replace("/", null)
    }

    // Deletes all created tacos
    deleteAllTacos () {
        this.setState({ tacos: [] })
        // Update cookie
        Cookies.set(COOKIE_KEY, [])
        this.props.onSave([])
    }

    // Deletes one taco within our stored array, given by index
    deleteOneTaco (i) {
        this.setState((prevState) => {
            const tacos = prevState.tacos.filter((item, j) => i != j)
            Cookies.set(COOKIE_KEY, tacos)
            this.props.onSave(tacos)
            return { tacos: tacos }
        })
    }

    // Given a new title, replace the old with the new, given a taco index
    saveTacoTitle (newTitle, i) {
        this.setState((prevState) => {
            const tacos = prevState.tacos.map((item, j) => {
                if (i === j)
                    return {
                        ...item,
                        title: newTitle
                    }
                return item
            })
            //Cookies.set(COOKIE_KEY, tacos)
            this.props.onSave(tacos)
            return { tacos: tacos }
        })
    }

    // Fetch a random taco and save it to our list of tacos
    getRandomTaco (e) {
        e.preventDefault();
        randomTacoConfig()
        .then(config => {
            this.saveTaco(config)
        })
    }

    // Handler for passed function to toggle dark mode
    handleCheckToggle (e) {
        this.props.onCheck()
    }

    render () {
        console.log(this.state.tacos)
        const { tacos, darkMode } = this.state
        return (
            <div className="body">
                <h1>The Taco Generator!</h1>
                <div>
                    <input type="checkbox" id="DarkMode" checked={this.props.checked} onChange={this.handleCheckToggle} />
                    <label for="DarkMode">Dark Mode</label>
                </div>
                <p>This web app aims to solve man's greatest problem, which isn't climate change, nor is it the crumbling faith towards our institutions, but rather it's the question of what kind of taco should you or I eat. Click either of the two buttons to find out. </p>
                <Link to="/form" className="linkButton acc1">Give me a new TACO!</Link>
                <a href="#" className="linkButton acc2" onClick={this.getRandomTaco}>Surprise me with a Random TACO!</a>
                <h3 className="acc2">Your Tacos</h3>
                <ul className="operations">
                    <li onClick={this.deleteAllTacos}>Delete All</li>
                </ul>
                <ul className="tacoList">
                    {tacos.length === 0 ? <p>Nothings here! We think you need more tacos in your life.</p> : null }
                    {
                        tacos.map((taco, i) => {
                        return <TacoCard
                            title={taco.title}
                            description={taco.description}
                            thumbnail={taco.thumbnail}
                            key={i}
                            index={i}
                            handleThisDelete={this.deleteOneTaco.bind(this, i)}
                            handleTitleSave={this.saveTacoTitle}
                        />
                    })
                }
                </ul>
            </div>
        )
    }

}

class TacoCard extends Component {

    constructor (props) {
        super(props)
        this.state = {
            title: this.props.title,
            showForm: false
        }
    }

    handleText = (e) => {
        this.setState({ title: e.target.value })
    }

    handleSave = (e) => {
        e.preventDefault()
        this.setState({ showForm: false })
        this.props.handleTitleSave(this.state.title, this.props.index)
    }

    render () {
        const {title, showForm} = this.state
        return (
            <li className="tacoListItem">
                <div className="flexContainer">
                    <img alt="taco" src={this.props.thumbnail} />
                    <div className="textContainer">
                        <div className="tacoTitle">{title}</div>
                        <div className="tacoDescription">{this.props.description}</div>
                    </div>
                </div>
                <ul className="operations">
                    <li onClick={this.props.handleThisDelete}>Delete</li>
                    <li onClick={(e) => this.setState({ showForm: !showForm })}>Edit Name</li>
                    { showForm ?
                    <form onSubmit={this.handleSave}>
                        <input type="text" value={title} onChange={this.handleText} />
                        <input type="submit" value="Submit" />
                    </form>
                    : null }
                </ul>
            </li>
        )
    }

}
