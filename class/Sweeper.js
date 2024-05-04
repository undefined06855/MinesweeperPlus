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

        this.tileSize = 720 / height

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
                if (cell.uncovered) {
                    tile.draw(cell)
                } else if (cell.flagged) {
                    tile.drawFlagged(cell)
                } else {
                    tile.drawCovered(cell)
                }
            }
        }
    }

    click(row, col) {
        let cell = this.grid[row][col]
        if (cell.uncovered) return
        cell.uncovered = true
        let cellOrigFlagged = cell.flagged
        cell.flagged = false
        if (cellOrigFlagged) tileManager.getTile(cell.id).onUnflagged(cell)
        tileManager.getTile(cell.id).onUncovered(cell)

        if (!tileManager.getTile(cell.id).disableAutoReveal && !tileManager.getTile(cell.id).isBomb) {
            let surroundingBombs = Utils.countSurroundingBombs(cell.row, cell.col)
            if (surroundingBombs == 0) {
                let surroundingCellLocations = [
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 0],
                    [1, 0],
                    [-1, 1],
                    [0, 1],
                    [1, 1]
                ]

                surroundingCellLocations.forEach(location => {
                    let newCell = Utils.getCellSafe(cell.row + location[0], cell.col + location[1])
                    if (newCell == false) return
                    if (!newCell.uncovered) {
                        this.click(newCell.row, newCell.col)
                    }
                })
            }
        }
    }

    flag(row, col) {
        let cell = this.grid[row][col]
        // shouldnt be able to flag / unflag if the cell has been uncovered
        if (cell.uncovered) return

        if (cell.flagged) {
            cell.flagged = false
            tileManager.getTile(cell.id).onUnflagged(cell)
        } else {
            cell.flagged = true
            tileManager.getTile(cell.id).onFlagged(cell)
        }
    }

    onClick(x, y) {
        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col > this.width) return

        this.click(row, col)
    }

    onFlag(x, y) {
        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col > this.width) return

        this.flag(row, col)
    }
}
