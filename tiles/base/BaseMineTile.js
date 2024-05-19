// base mine tile for other tiles to extend off of
class BaseMineTile extends BaseTile {
    static isMine = true
    static disableAutoReveal = true

    /**
     * @param {Cell} cell 
     */
    static onUncovered(cell) {
        sweeper.kablooey()
    }

    /**
     * @param {Cell} cell 
     */
    static drawExploded(cell) {
        
    }
}
