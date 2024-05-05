// generic mine tile
class MineTile extends BaseMineTile {
    static async load() {
        return new Promise(resolve => {
            Utils.tileLoadImageAssets("MineTile", ["mine.png", "mine-reveal.png"])
            .then(images => {
                MineTile.mineImage = images[0]
                MineTile.mineExplodedImage = images[1]
                resolve()
            })
        })
    }

    /**
     * @param {Cell} cell 
     */
    static drawExploded(cell) {
        ctx.drawImage(
            MineTile.mineExplodedImage,
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
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
