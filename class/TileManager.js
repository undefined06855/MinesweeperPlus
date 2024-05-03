class TileManager {
    constructor() {
        // <any> here is actually a BaseTile but you can't show that in JSDoc
        // without it assuming it's an instance of a BaseTile (which obviously
        // wont have any of the static stuff)
        /** @type Array<any> */
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
