// generic "normal" tile
class GenericTile extends BaseTile {
    static async load() {
        return new Promise(resolve => {
            Utils.genericLoadImageAssets("GenericTile", ["0.png", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"])
            .then(images => {
                GenericTile.images = []
                for (let i = 0; i <= 8; i++) {
                    GenericTile.images[i] = images[i]
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
        cell.data.mineCount = 0

        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row - 1][cell.col - 1].id).isMine ? 1 : 0 } catch(_) {}
        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row    ][cell.col - 1].id).isMine ? 1 : 0 } catch(_) {}
        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row + 1][cell.col - 1].id).isMine ? 1 : 0 } catch(_) {}

        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row - 1][cell.col    ].id).isMine ? 1 : 0 } catch(_) {}

        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row + 1][cell.col    ].id).isMine ? 1 : 0 } catch(_) {}

        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row - 1][cell.col + 1].id).isMine ? 1 : 0 } catch(_) {}
        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row    ][cell.col + 1].id).isMine ? 1 : 0 } catch(_) {}
        try { cell.data.mineCount += tileManager.getTile(sweeper.grid[cell.row + 1][cell.col + 1].id).isMine ? 1 : 0 } catch(_) {}
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        ctx.drawImage(
            GenericTile.images[cell.data.mineCount],
            cell.col * sweeper.tileSize,
            cell.row * sweeper.tileSize,
            sweeper.tileSize,
            sweeper.tileSize
        )
    }
}
