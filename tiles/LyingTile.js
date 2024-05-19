class LyingTile extends GenericTile {
    static name = "lying tile"
    static description = [ "A normal tile. Or is it?" ]
    static generationChance = 0.01
    static appearsInTitle = false

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        // generictile but with random mine count
        cell.data.mineCount = ~~(Math.random() * 8) + 1
    }

    /**
     * @param {number} index 
     * @param {number} width 
     * @param {number} height 
     */
    static drawPreview(index, width, height) {
        let imageIndex = (index + 7) % 8 + 1
        ctx.drawImage(
            GenericTile.images[~~imageIndex],
            0,
            0,
            width,
            height
        )
    }
}