class GenericTile extends BaseTile {
    static name = "normal tile"
    static description = [ "A normal tile, does what you expect." ]
    static async load() {
        return new Promise(resolve => {
            Utils.tileLoadImageAssets("GenericTile", ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"])
            .then(images => {
                GenericTile.images = []
                for (let i = 0; i <= 8; i++) {
                    GenericTile.images[i + 1] = images[i]
                }

                resolve()
            })
        })
    }

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        // count cells around the cell
        cell.data.mineCount = Utils.countSurroundingBombs(cell.row, cell.col)
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        ctx.drawImage(
            GenericTile.images[cell.data.mineCount],
            0,
            0,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }

    /**
     * @param {number} index 
     * @param {number} width 
     * @param {number} height 
     */
    static drawPreview(index, width, height) {
        let imageIndex = index % 8 + 1
        ctx.drawImage(
            GenericTile.images[~~imageIndex],
            0,
            0,
            width,
            height
        )
    }
}
