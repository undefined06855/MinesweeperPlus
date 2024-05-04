class Sweeper {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} mines 
     */
    constructor(width, height, mines) {
        // lamp oil?
        /** @type Array<Array<Cell>> */
        this.grid = []
        this.width = width
        this.height = height
        this.mines = mines

        this.firstClick = true

        this.tileSize = 720 / height
        this.createGrid()
    }

    createGrid() {
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            let row = []
            for (let colIndex = 0; colIndex < this.width; colIndex++) {
                let cell = new Cell(tileManager.getRandomNonBombTileID(), rowIndex, colIndex)
                row.push(cell)
            }

            this.grid.push(row)
        }

        for (let i = 0; i < this.mines; i++) {
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

        // auto reveal
        if (!tileManager.getTile(cell.id).disableAutoReveal) {
            let surroundingBombs = Utils.countSurroundingBombs(cell.row, cell.col)
            if (surroundingBombs == 0) {
                Utils.loopOverSurroundingCells(cell.row, cell.col, cell => {
                    if (!cell.uncovered) {
                        this.click(cell.row, cell.col)
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

    kablooey() {
        // Kaboom?
        // Yes Rico, kaboom.
        
    }

    onClick(x, y) {
        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col > this.width) return

        if (this.firstClick) {
            // first click should never be a mine (obviously) so regenerate grid
            // until it isnt a mine
            while (tileManager.getTile(this.grid[row][col].id).isMine) {
                console.log("first click is a mine! regenerating grid...")
                this.grid = []
                this.createGrid()
            }
            
            // then initialise tiles on first click
            this.initTiles()
        }

        this.firstClick = false

        this.click(row, col)
    }

    onFlag(x, y) {
        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col > this.width) return

        this.flag(row, col)
    }
}
