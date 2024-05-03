// base mine tile for other tiles to extend off of
class BaseMineTile extends BaseTile {
    static isMine = true

    static async load() {
        throw(new Error("A static async load() must be defined when extending BaseMineTile!"))
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        throw(new Error("A static init(Cell*) must be defined when extending BaseMineTile!"))
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        throw(new Error("A static draw(Cell*) must be defined when extending BaseMineTile!"))
    }
}
