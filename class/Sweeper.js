class Sweeper {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} bombs 
     */
    constructor(width, height, bombs) {
        // lamp oil?
        /** @type Array<Array<Cell>> */
        this.grid = []
        this.width = width
        this.height = height
        this.bombs = bombs

        this.tileSize = 72

        // rope?
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            let row = []
            for (let colIndex = 0; colIndex < width; colIndex++) {
                let cell = new Cell(tileManager.getRandomNonBombTileID(), rowIndex, colIndex)
                row.push(cell)
            }

            this.grid.push(row)
        }

        // bombs?
        for (let i = 0; i < bombs; i++) {
            let row = ~~(Math.random() * this.grid.length)
            let col = ~~(Math.random() * this.grid[row].length)
            this.grid[row][col] = new Cell(tileManager.getRandomBombTileID(), row, col)
        }
    }

    initTiles() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cell = this.grid[row][col]
                let tile = tileManager.getTile(cell.id)
                tile.init(cell)
            }
        }
    }

    draw() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col]
                let tile = tileManager.getTile(cell.id)
                tile.draw(cell)
            }
        }
    }
}
