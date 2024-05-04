// generic mine tile
class MineTile extends BaseMineTile {
    static async load() {
        return new Promise(resolve => {
            Utils.tileLoadImageAssets("MineTile", ["bomb.png"])
            .then(images => {
                MineTile.bombImage = images[0]
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
            MineTile.bombImage,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }
}
