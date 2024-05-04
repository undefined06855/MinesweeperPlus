// base tile for other tiles to extend off of
class BaseTile {
    static isMine = false
    static disableAutoReveal = false

    /**
     * @returns {undefined | Promise<void>}
     */
    static async load() {

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

    /**
     * @param {Cell} cell 
     */
    static drawCovered(cell) {
        ctx.drawImage(
            GlobalAssets.covered,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    /**
     * @param {Cell} cell 
     */
    static drawFlagged(cell) {
        ctx.drawImage(
            GlobalAssets.flagged,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    /**
     * @param {Cell} cell 
     */
    static onUncovered(cell) {
        console.log("Cell uncovered")
    }

    /**
     * @param {Cell} cell 
     */
    static onFlagged(cell) {
        console.log("Cell flagged")
    }

    
    /**
     * @param {Cell} cell 
     */
    static onUnflagged(cell) {
        console.log("Cell unflagged")
    }
}
