// base tile for other tiles to extend off of
class BaseTile {
    static isMine = false

    /**
     * @returns {undefined | Promise<void>}
     */
    static async load() {
        throw(new Error("A static async load() must be defined when extending BaseTile!"))
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        throw(new Error("A static init(Cell*) must be defined when extending BaseTile!"))
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        throw(new Error("A static draw(Cell*) must be defined when extending BaseTile!"))
    }
}
