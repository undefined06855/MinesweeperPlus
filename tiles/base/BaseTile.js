// base tile for other tiles to extend off of
class BaseTile {
    static isMine = false
    static disableAutoReveal = false
    static generationChance = 1
    static overrides0Tile = false
    
    // this gets set by TileManager
    static mappedGenerationChance

    /**
     * @returns {undefined | Promise<void>}
     */
    static async load() {
        console.debug("Cell loading")
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        console.debug("Cell initialising")
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        console.debug("Cell drawing")
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
    static draw0Tile(cell) {
        ctx.drawImage(
            GlobalAssets.tile0,
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
    static drawFlaggedWrong(cell) {
        ctx.drawImage(
            GlobalAssets.flaggedWrong,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    /**
     * @param {Cell} cell 
     */
    static drawFallback(cell) {
        ctx.fillStyle = "#ff00f2"
        ctx.fillRect(
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
        console.debug("Cell uncovered")
    }

    /**
     * @param {Cell} cell 
     */
    static onFlagged(cell) {
        console.debug("Cell flagged")
    }
    
    /**
     * @param {Cell} cell 
     */
    static onUnflagged(cell) {
        console.debug("Cell unflagged")
    }
}
