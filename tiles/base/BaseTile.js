// base tile for other tiles to extend off of
class BaseTile {
    static isMine = false
    static disableAutoReveal = false
    static generationChance = 1
    static appearsInTitle = true
    static name = "(unnamed tile)"
    static description = [ "(no description)" ]
    static cullMargin = 0

    // this gets set by TileManager
    static mappedGenerationChance = null

    /**
     * @returns {undefined | Promise<void>}
     */
    static async load() {

    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        BaseTile.drawFallback(cell)
    }

    /**
     * @param {number} index 
     * @param {number} width 
     * @param {number} height 
     */
    static drawPreview(index, width, height) {
        BaseTile.drawFallback()
    }

    /**
     * @param {Cell} cell 
     */
    static drawCovered(cell) {
        ctx.drawImage(
            GlobalAssets.covered,
            0,
            0,
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
            0,
            0,
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
            0,
            0,
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
            0,
            0,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    /**
     * @param {Cell} cell 
     */
    static drawFallback(cell) {
        ctx.fillStyle = "#ff00f2"

        try {
            ctx.fillRect(
                0,
                0,
                sweeper.tileSize,
                sweeper.tileSize
            )
        } catch(_) {
            ctx.fillRect(
                0,
                0,
                // eh probably close enough to what you want
                48,
                48
            )
        }

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
