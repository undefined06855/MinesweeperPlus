// base mine tile for other tiles to extend off of
class BaseMineTile extends BaseTile {
    static isMine = true
    static disableAutoReveal = true

    /**
     * Runs when the tile gets uncovered - fallback provided
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static onUncovered(cell) {
        sweeper.kablooey()
    }

    /**
     * Runs when the tile needs to be drawn exploded when the player clicks on it at the end of the game
     * @param {Cell} cell The cell object that is linked to this instance
     */
    static drawExploded(cell) {
        
    }
}
