/** @enum */
const FontFamily = {
    Righteous: "Righteous",
    RockSalt: "Rock Salt"
}

class Fonter {
    /**
     * @param {string} fontFamily 
     * @param {number} size 
     * @returns {string}
     */
    static get(fontFamily, size) {
        if (fontFamily.split(" ").length != 1)
            return `${size}px "${fontFamily}"`
        return `${size}px ${fontFamily}`
    }
}
