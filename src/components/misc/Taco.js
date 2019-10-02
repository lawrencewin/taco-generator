import FoodWords from "./FoodWords"

const API_URL = "https://ct-tacoapi.azurewebsites.net"

// Useful variables
const VOWELS = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]
const MAX_SELECTED = {
    shells: 1,
    baseLayers: 2,
    mixins: 2,
    condiments: 3,
    seasonings: 1
}

const options = {
    shells: undefined,
    baseLayers: undefined,
    mixins: undefined,
    condiments: undefined,
    seasonings: undefined
}

const thumbUrls = ["https://www.thewholesomedish.com/wp-content/uploads/2019/06/The-Best-Classic-Tacos-550.jpg", "https://www.thewholesomedish.com/wp-content/uploads/2019/06/The-Best-Classic-Tacos-550.jpg", "https://emilybites.com/wp-content/uploads/2019/03/Chili-Cheese-Tacos-3b-620x620.jpg", "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/screen-shot-2019-07-16-at-4-07-03-pm-1563307642.png?crop=0.9962825278810409xw:1xh;center,top&resize=480:*"]

// Returns a capitalized version of the given string
function capitalized (string) {
    return string.charAt(0).toUpperCase() + string.substring(1)
}

// Gets a random element from a given array
function randChoice (arr) { return arr[randInt(arr.length)] }

// Gets a random integer from the range of floor (inclusive) to int + floor (exclusive)
function randInt (int, floor = 0) { return Math.floor(Math.random() * int) + floor }

// Turns an array of strings into a string containing all strings in the array, separated by commas and the correct conjunctions
function toConjuncted (arr) {
    const a = arr.map(str => {
        return str.trim()
    })
    if (a.length === 1) {
        return a[0]
    } else if (a.length === 2) {
        return a[0] + " and " + a[1]
    } else {
        return a.reduce((sum, el, i) => {
            if (i === 0)
                return el
            else if (i === arr.length - 1)
                return sum + ", and " + el
            else
                return sum + ", " + el
        })
    }
}

// Returns "an" or "a" depending on whether the passed word starts with a vowel or not
function aOrAn (word) {
    console.log(word.charAt(0))
    if (VOWELS.includes(word.charAt(0))) return "an"
    return "a"
}

// Creates a description string using a taco config and a food word generator class
function getDescriptionString (configObject, foodWords) {
    const { shells, baseLayers, mixins, condiments, seasonings } = configObject
    const word1 = foodWords.getAdjective(), word2 = foodWords.getAdjective()
    return `${capitalized(aOrAn(word1))} ${word1} ${toConjuncted(baseLayers)} taco ${foodWords.getVerb("shells")} in ${toConjuncted(shells)}, ${foodWords.getVerb("mixins")} with some ${word2} ${toConjuncted(mixins)}, ${foodWords.getVerb("condiments")} with ${toConjuncted(condiments)}, and ${foodWords.getVerb("seasonings")} with a ${toConjuncted(seasonings)}.`
}

// Creates a title string using a taco config and a food word generator class
function getTitle (configObject, foodWords) {
    const base = toConjuncted(configObject.baseLayers)
    const adj = foodWords.getAdjective()
    return `${capitalized(aOrAn(adj))} ${capitalized(adj)} ${base} Taco.`
}

// Taco class which takes a taco configuration and generates a title, description, and thumbnail
export default class Taco {

    constructor (config) {
        const words = new FoodWords()
        this.title = getTitle(config, words)
        this.description = getDescriptionString(config, words)
        this.thumbnail = randChoice(thumbUrls) // Just get from 4 urls in an array above
        this.config = config
    }

}

// Calls the api to get ingredients and randomly assembles a taco based on our given ingredient count limits
export async function randomTacoConfig () {
    const config = { isTaco: true }
    for (const option of Object.keys(options)) {
        // Fetch from endpoint if needed
        if (options[option] === undefined) {
            const response = await fetch(API_URL + "/" + option)
            options[option] = await response.json()
            // Remove parenthesis in an ingredient name for readability
            for (const choice of options[option]) {
                let name = choice.name
                if (name.includes("\(")) {
                    choice.name = name.replace(/ *\([^)]*\) */g, "")
                }
            }
        }
        // Pick a random # of ingredients within our allowed range and then pick random, unique ingredients from the category lists
        config[option] = []
        for (let i = 0; i <= randInt(MAX_SELECTED[option]); i++) {
            let choice = randChoice(options[option])
            while (config[option].includes(choice.name))
                choice = randChoice(options[option])
            config[option].push(choice.name)
        }
    }
    return config
}
