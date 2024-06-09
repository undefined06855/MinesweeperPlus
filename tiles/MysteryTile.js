class MysteryTile extends BaseTile {
    static name = "mystery tile"
    static description = [ "Mysterious! It doesn't tell you how many mines", "actually surrounds it.", "", "(this is a very placeholder image)" ]
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
            0,
            0,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    static drawPreview(index, width, height) {
        ctx.drawImage(
            MysteryTile.tileImage,
            0,
            0,
            width,
            height
        )
    }
}
