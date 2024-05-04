// generic mine tile
class MineTile extends BaseMineTile {
    static async load() {
        return new Promise(resolve => {
            Utils.tileLoadImageAssets("MineTile", ["mine.png"])
            .then(images => {
                MineTile.mineImage = images[0]
                resolve()
            })
        })
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
        ctx.drawImage(
            MineTile.mineImage,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }
}
