class MysteryTile extends BaseTile {
    static generationChance = 0.07

    static async load() {
        return new Promise(resolve => {
            Utils.tileLoadImageAssets("MysteryTile", ["tile.png"])
            .then(images => {
                MysteryTile.tileImage = images[0]
                resolve()
            })
        })
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        Utils.countSurroundingBombs(cell.row, cell.col)
    }
    
    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        ctx.drawImage(
            MysteryTile.tileImage,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }
}
