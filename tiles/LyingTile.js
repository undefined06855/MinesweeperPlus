class LyingTile extends GenericTile {
    static generationChance = 0.01

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        // generictile but with random mine count
        cell.data.mineCount = ~~(Math.random() * 8) + 1
    }
}