class MineTile extends BaseMineTile {
    static name = "normal mine"
    static description = [ "A normal mine, does what you expect.", "Click leads to kablooey, you know." ]
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
            0,
            0,
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
        ctx.drawImage(
            MineTile.mineImage,
            0,
            0,
            width,
            height
        )
    }
}
