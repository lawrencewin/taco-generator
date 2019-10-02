// Lists of words to give when a user asks for a adjective or verb
const ADJECTIVES = [ "delicious", "savory", "flavorful", "delectable", "amazing", "warm", "fulfilling", "aromatic", "fresh", "tasty", "tantalizing", "succulent", "yummy", "rich", "hearty", "intense", "enticing", "appetizing", "splendid", "distinctive", "heavenly", "tempting", "piquant", "luscious", "nectarous", "gratifying", "pleasant", "divine"]
const SHELL_VERBS = ["wrapped", "enveloped", "cradled", "covered"]
const MIXIN_VERBS = ["mixed", "complemented", "accompanied", "joined"]
const CONDIMENT_VERBS = ["dashed", "drizzled", "poured", "blanketed", "covered", "dolloped", "coated", "served", "spread"]
const SEASONING_VERBS = ["peppered", "sprinkled", "topped", "seasoned"]

// Removes and returns a random element from an array
function getWord (words) {
    if (words.length === 0) return null
    const randomIndex = Math.floor(Math.random() * words.length)
    return words.splice(randomIndex, 1)[0]
}

// This class takes our list of words in this file and will give a unique word each time it's asked for one.
// E.g. if a new FoodWords is initialized, getAdjective() may return "delicious". Any subsequent calls can only return the remaining
// words in the object's list as delicious has already been gotten and removed.
export default class FoodWords {

    constructor () {
        // We use concat to create a deep copy of the array of strings, rather than a reference
        this.adjectives = ADJECTIVES.concat([])
        this.shVerbs = SHELL_VERBS.concat([])
        this.mVerbs = MIXIN_VERBS.concat([])
        this.cVerbs = CONDIMENT_VERBS.concat([])
        this.seVerbs = SEASONING_VERBS.concat([])
    }

    // Gets and removes one food adjective
    getAdjective () {
        return getWord(this.adjectives)
    }

    // Based on the given type of food, get a verb to go with it
    getVerb (type) {
        let verbs
        switch (type) {
            case "shells":
                verbs = this.shVerbs
                break
            case "mixins":
                verbs = this.mVerbs
                break
            case "condiments":
                verbs = this.cVerbs
                break
            case "seasonings":
                verbs = this.seVerbs
                break
            default:
                return
        }
        return getWord(verbs)
    }

}
