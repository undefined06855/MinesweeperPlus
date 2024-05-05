class TileManager {
    constructor() {
        /** @type Array<typeof BaseTile> */
        this.tiles = []
    }

    /**
     * @param {any} tile 
     */
    async register(tile) {
        this.tiles.push(tile)
        await tile.load()
    }

    getTile(index) {
        return this.tiles[index]
    }

    getRandomNonBombTileID() {
        let id
        do {
            id = ~~(this.tiles.length * Math.random())
        } while (this.getTile(id).isMine)

        return id
    }

    getRandomBombTileID() {
        let id
        do {
            id = ~~(this.tiles.length * Math.random())
        } while (!this.getTile(id).isMine)

        return id
    }
}
