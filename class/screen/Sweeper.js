class Sweeper extends InitialisableClass {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} mines 
     */
    constructor(width, height, mines) {
        super()
        /** @type Array<Array<Cell>> */
        this.grid = []
        this.width = width
        this.height = height
        this.mines = mines

        /** @type Array<Anim> */
        this.animations = []

        this.firstClick = true
        this.state = SweeperState.Playing

        this.tileSize = 1080 / height
        this.offsetX = 0
        this.offsetY = 0
        
        this.createGrid()
    }

    init() {
        EventHandler.registerButton(0, 0, 1920, 1080, (x, y) => this.onClick(x, y), true)

        EventHandler.registerButton(0, 0, 1920, 1080, (x, y) => this.onFlag(x, y), true, 2)
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
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, 1920, 1080)

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col]
                let tile = tileManager.getTile(cell.id)

                ctx.translate(cell.col * this.tileSize, cell.row * this.tileSize)
 
                switch(cell.state) {
                    case CellState.Uncovered:
                        // uncovered mines should be exploded
                        if (tile.isMine) tile.drawExploded(cell)
                        else {
                            // check if it's in the middle and if it overrides the 0 tile
                            let surrounding = Utils.countSurroundingBombs(row, col)
                            if (surrounding == 0) tile.draw0Tile(cell)
                            else                  tile.draw(cell)
                        }
                        break
                    // flagged are just flagged
                    case CellState.Flagged:
                        // if it's not a mine and flagged it's wrong
                        if (this.state == SweeperState.Exploded && !tile.isMine)
                            tile.drawFlaggedWrong(cell)
                        else tile.drawFlagged(cell)
                        break
                    case CellState.Covered:
                        // if we;ve exploded, just draw all the mines even if
                        // they're covered
                        if (tile.isMine && this.state == SweeperState.Exploded)
                            tile.draw(cell)
                        // else just draw normally
                        else tile.drawCovered(cell)
                        
                        break
                    
                    default:
                        tile.drawFallback(cell)
                }

                // if i use reset here animations wont work
                ctx.translate(-cell.col * this.tileSize, -cell.row * this.tileSize)

            }
        }
    }

    click(row, col) {
        if (GameHandler.state != GameState.Game) return

        let cell = this.grid[row][col]
        // shouldnt be able to click if the cell has been uncovered
        if (cell.state == CellState.Uncovered) return

        let origCellState = cell.state
        cell.state = CellState.Uncovered

        if (origCellState == CellState.Flagged) tileManager.getTile(cell.id).onUnflagged(cell)
        tileManager.getTile(cell.id).onUncovered(cell)

        // auto reveal
        if (!tileManager.getTile(cell.id).disableAutoReveal) {
            let surroundingBombs = Utils.countSurroundingBombs(cell.row, cell.col)
            if (surroundingBombs == 0) {
                Utils.loopOverSurroundingCells(cell.row, cell.col, cell => {
                    if (cell.state != CellState.Uncovered) {
                        this.click(cell.row, cell.col)
                    }
                })
            }
        }
    }

    flag(row, col) {
        if (GameHandler.state != GameState.Game) return

        let cell = this.grid[row][col]
        // shouldnt be able to flag / unflag if the cell has been uncovered
        if (cell.state == CellState.Uncovered) return

        if (cell.state == CellState.Flagged) {
            cell.state = CellState.Covered
            tileManager.getTile(cell.id).onUnflagged(cell)
        } else {
            cell.state = CellState.Flagged
            tileManager.getTile(cell.id).onFlagged(cell)
        }
    }

    kablooey() {
        // Kaboom?
        // Yes Rico, kaboom.
        this.state = SweeperState.Exploded
        this.animations.push(new Anim(AnimType.Shake, 24, 370, this.animations))
    }

    onClick(x, y) {
        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col >= this.width) return
        if (row >= this.height) return
        
        if (this.state != SweeperState.Playing) return
        console.log("op")
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

        if (col >= this.width) return
        if (row >= this.height) return
        if (this.state != SweeperState.Playing) return

        this.flag(row, col)
    }
}

/** @enum */
const SweeperState = {
    Playing: 0,
    Exploded: 1,
    Detonated: 2
}
