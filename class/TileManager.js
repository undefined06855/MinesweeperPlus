class TileManager {
    constructor() {
        /** @type Array<typeof BaseTile> */
        this.tiles = []
        this.totalGenerationChance = 0
    }

    /**
     * @param {typeof BaseTile} tile 
     */
    async register(tile) {
        this.tiles.push(tile)
        this.totalGenerationChance += tile.generationChance
        await tile.load()
    }

    finishRegister() {
        // calculate percentage chances for tiles
        for (let tile of this.tiles) {
            tile.mappedGenerationChance = tile.generationChance / this.totalGenerationChance
        }
    }

    getTile(index) {
        return this.tiles[index]
    }

    getRandomNonBombTileID() {
        let id
        do {
            do {
                id = ~~(this.tiles.length * Math.random())
            } while (this.getTile(id).mappedGenerationChance <= Math.random())
        } while (this.getTile(id).isMine)

        return id
    }

    getRandomBombTileID() {
        let id
        do {
            do {
                id = ~~(this.tiles.length * Math.random())
            } while (this.getTile(id).mappedGenerationChance <= Math.random())
        } while (!this.getTile(id).isMine)

        return id
    }
}
