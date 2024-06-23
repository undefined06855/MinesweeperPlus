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
     * Runs when the tile needs to load assets
     * @returns {undefined | Promise<void>}
     */
    static async load() {

    }

    /**
     * Runs when the tile is first generated
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static init(cell) {
        
    }

    /**
     * Runs when the tile is drawn
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static draw(cell) {

    }

    /**
     * Runs when the tile preview needs to be drawn
     * @param {number} index A random index which could be used to seed random generators
     * @param {number} width The width of the area that needs to be drawn
     * @param {number} height The height of the area that needs to be drawn
     */
    static drawPreview(index, width, height) {

    }

    /**
     * Runs when the tile needs to be drawn but covered - fallback provided
     * @param {Cell} cell The cell object that is linked to this instance
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
     * Runs when the tile needs to be drawn inside other tiles (i.e - no surrounding bombs) - fallback provided
     * @param {Cell} cell The cell object that is linked to this instance
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
     * Runs when the tile needs to be drawn but flagged - fallback provided
     * @param {Cell} cell The cell object that is linked to this instance
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
     * Runs when the tile needs to be drawn but flagged wrong at the end of the game - fallback provided
     * @param {Cell} cell The cell object that is linked to this instance
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
     * Runs when the tile gets uncovered
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static onUncovered(cell) {

    }

    /**
     * Runs when the tile gets flagged
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static onFlagged(cell) {

    }
    
    /**
     * Runs when the tile gets unflagged
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static onUnflagged(cell) {

    }
}
