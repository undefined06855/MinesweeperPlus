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

        this.tileSize = 60
        this.offsetX = (1920 / 2) - (this.width * this.tileSize / 2)
        this.offsetY = (1080 / 2) - (this.height * this.tileSize / 2)

        this.dragStartMouseX = 0
        this.dragStartMouseY = 0
        this.dragStartOffsetX = 0
        this.dragStartOffsetY = 0
        this.isDragging = false

        this.gameOverAnimationTimer = 0
        
        this.createGrid()
    }

    init() {
        // detect and register buttons for right and left click
        EventHandler.registerButton(0, 0, 1920, 1080, (x, y) => this.onClick(x, y), true)
        EventHandler.registerButton(0, 0, 1920, 1080, (x, y) => this.onFlag(x, y), true, 2)
        
        // and the dragging and scrolling
        EventHandler.registerMouseMove(0, 0, 1920, 1080, (x, y, event) => this.onMouseMove(x, y, event))
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
            if (tileManager.getTile(this.grid[row][col].id).isMine) {
                // "skip" this current iteration if mine already present
                console.log("mine present")
                i++
                continue
            }
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

__HIPERFORMANCE(() => {
        // draw shadow
        ctx.filter = "blur(60px)"
        ctx.fillStyle = "#00000096"
        ctx.fillRect(this.offsetX, this.offsetY, this.tileSize * this.grid[0].length, this.tileSize * this.grid.length)
        ctx.filter = "none"
})

        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col]
                let tile = tileManager.getTile(cell.id)

                let x = cell.col * this.tileSize + this.offsetX
                let y = cell.row * this.tileSize + this.offsetY

                if (x > 1920 + tile.cullMargin) continue
                if (y > 1080 + tile.cullMargin) continue
                if (x < -this.tileSize - tile.cullMargin) continue
                if (y < -this.tileSize - tile.cullMargin) continue

                ctx.translate(x, y)
 
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
                ctx.translate(-x, -y)

            }
        }

        // draw ui

    }

    drawPostAnimations() {
        ctx.lineWidth = 10

        ctx.textAlign = "left"
        ctx.fillStyle = "#ffffff"
        ctx.strokeStyle = "#000000"
        ctx.font = Fonter.get("monospace", 15)
        ctx.strokeText(`${this.animations.length} animations:`, 50, 120)
        ctx.fillText(`${this.animations.length} animations:`, 50, 120)

        let y = 150
        for (let animation of this.animations) {
            let str = `Anim: ${animation.type} (${animation.timer.toPrecision(3)} / ${animation.length.toPrecision(3)})`
            ctx.strokeText(str, 50, y)
            ctx.fillText(str, 50, y)
            y += 30
        }
        ctx.textAlign = "center"
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

    checkGameComplete() {
        // loop through all tiles and see if all tiles are revealed or mines
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let tile = this.grid[row][col]
                if (tileManager.getTile(tile.id).isMine || tile.state == CellState.Uncovered) {
                    continue
                }

                // else you failed >:(
                console.log("not all uncovered yet")
                return
            }
        }

        console.log("well done!!!!!")
        alert("uhhh well done! you did it ig make sure to add a well done screen or something")
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    onClick(x, y) {
        x -= this.offsetX
        y -= this.offsetY

        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col >= this.width) return
        if (row >= this.height) return
        if (col < 0) return
        if (row < 0) return
        
        if (this.state != SweeperState.Playing) return
        if (this.firstClick) {
            // first click should never be a mine (obviously) so regenerate grid
            // until it isnt a mine
            while (tileManager.getTile(this.grid[row][col].id).isMine) {
                this.grid = []
                this.createGrid()
            }
            
            // then initialise tiles on first click
            this.initTiles()
        }

        this.firstClick = false

        this.click(row, col)
        this.checkGameComplete()
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    onFlag(x, y) {
        x -= this.offsetX
        y -= this.offsetY

        let col = ~~(x / this.tileSize)
        let row = ~~(y / this.tileSize)

        if (col >= this.width) return
        if (row >= this.height) return
        if (col < 0) return
        if (row < 0) return
        if (this.state != SweeperState.Playing) return

        this.flag(row, col)
        this.checkGameComplete()
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {MouseEvent} event 
     */
    onMouseMove(x, y, event) {
        if (event.buttons == 4 || (event.shiftKey && event.buttons == 1)) {
            if (!this.isDragging) {
                // started dragging
                this.dragStartMouseX = x
                this.dragStartMouseY = y
                this.dragStartOffsetX = this.offsetX
                this.dragStartOffsetY = this.offsetY
            } else {
                // continue dragging
                this.offsetX = (x - this.dragStartMouseX) + this.dragStartOffsetX 
                this.offsetY = (y - this.dragStartMouseY) + this.dragStartOffsetY 
            }

            this.isDragging = true
        } else {
            this.isDragging = false
        }
    }
}

/** @enum */
const SweeperState = {
    Playing: 0,
    Exploded: 1,
    Detonated: 2
}
