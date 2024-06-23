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
        this.origOffsetX = this.offsetX
        this.origOffsetY = this.offsetY
        this.offsetXBeforeAnimation = this.offsetX
        this.offsetYBeforeAnimation = this.offsetY

        this.dragStartMouseX = 0
        this.dragStartMouseY = 0
        this.dragStartOffsetX = 0
        this.dragStartOffsetY = 0
        this.isDragging = false

        this.gameOverAnimationTimer = 0
        this.hasPlayedGameOverShake = false

        // these update at the end
        this.tilesUncovered = 0
        this.minesCorrectlyFlagged = 0
        this.tilesIncorrectlyFlagged = 0

        /** @type typeof BaseTile */
        this.tileJustClicked = null
        
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
            let row = ~~(Math.random() * this.height)
            let col = ~~(Math.random() * this.width)
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

    tick() {
        if (this.state != SweeperState.Playing) {
            this.gameOverAnimationTimer += dt

            let easedProgress = Easing.easeInOut(this.gameOverAnimationTimer / 2000)

            // and slowly zoom out and move camera back to middle (and reset zoom)
            this.offsetX = this.offsetXBeforeAnimation + easedProgress * (this.origOffsetX - this.offsetXBeforeAnimation)
            this.offsetY = this.offsetYBeforeAnimation + easedProgress * (this.origOffsetY - this.offsetYBeforeAnimation)

            if (this.gameOverAnimationTimer >= 1700 && !this.hasPlayedGameOverShake) {
                // shake when the title hits the screen
                this.animations.push(new Anim(AnimType.Shake, 24, 500, this.animations))
                this.hasPlayedGameOverShake = true
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
        ctx.fillRect(this.offsetX, this.offsetY, this.tileSize * this.width, this.tileSize * this.height)
        ctx.filter = "none"
})

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
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
                        throw new Error(`Cell is not in a valid state (${cell.state})!`)
                }

                // if i use reset here animations wont work
                ctx.translate(-x, -y)

            }
        }

        // draw ui
        // ctx.textAlign = "left"
        // ctx.fillText(`offsetX: ${this.offsetX}`, 50, 140)
        // ctx.fillText(`offsetY: ${this.offsetY}`, 50, 160)
        // ctx.fillText(`offsetXBeforeAnim: ${this.offsetXBeforeAnimation}`, 50, 190)
        // ctx.fillText(`offsetYBeforeAnim: ${this.offsetYBeforeAnimation}`, 50, 210)
        // ctx.fillText(`origOffsetX: ${this.origOffsetX}`, 50, 240)
        // ctx.fillText(`origOffsetY: ${this.offsetYBeforeAnimation}`, 50, 260)
        // ctx.textAlign = "center"
            
        // draw end screen
        if (this.state != SweeperState.Playing) {
            // draw overlay to darken everything
            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 500) / 1000

            ctx.fillStyle = "#050505a6"
            ctx.fillRect(0, 0, 1920, 1080)

            ctx.globalAlpha = 1

            ctx.fillStyle = "#000000"
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 15
            ctx.font = Fonter.get(FontFamily.Righteous, 100)

            let gameOverCaptionTimer = Math.max(0, this.gameOverAnimationTimer - 1200)

            let titleWobbleY = Math.sin(this.gameOverAnimationTimer / 500) * 10
            // copied from Title.js
            let length = 500
            let endingRotation = 3 * (Math.PI / 180)
            let scaleAnimationFunction = x => -4.8e-7 * x**3 + 60
            let rotationAnimationFunction = x => 1.28e-15 * x**6 - 20 - endingRotation
            let alphaAnimationFunction = x => x < 50 ? 0 : 0.004 * x - 0.2
            if (gameOverCaptionTimer < length) {
                ctx.globalAlpha = alphaAnimationFunction(gameOverCaptionTimer)
                ctx.translate(960, 130)
                ctx.scale(scaleAnimationFunction(gameOverCaptionTimer), scaleAnimationFunction(gameOverCaptionTimer))
                ctx.rotate(rotationAnimationFunction(gameOverCaptionTimer) * (Math.PI / 180))
                ctx.translate(-960, -130)
            } else {
                ctx.translate(960, 130)
                ctx.rotate(endingRotation, endingRotation)
                ctx.translate(-960, -130)
            }
            ctx.translate(0, titleWobbleY)
            ctx.strokeText("GAME OVER", 960, 130)
            ctx.fillText("GAME OVER", 960, 130)
            ctx.translate(0, -titleWobbleY)
            if (gameOverCaptionTimer < length) {
                ctx.translate(960, 130)
                ctx.scale(1 / scaleAnimationFunction(gameOverCaptionTimer), 1 / scaleAnimationFunction(gameOverCaptionTimer))
                ctx.rotate(-rotationAnimationFunction(gameOverCaptionTimer) * (Math.PI / 180))
                ctx.translate(-960, -130)
                ctx.globalAlpha = 1
            } else {
                ctx.translate(960, 130)
                ctx.rotate(-endingRotation, -endingRotation)
                ctx.translate(-960, -130)
            }

            ctx.lineWidth = 7
            ctx.font = Fonter.get(FontFamily.Righteous, 40)

            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 2000) / 700 
            ctx.strokeText("you hit a mine!", 960, 270)
            ctx.fillText("you hit a mine!", 960, 270)

            // figure out where the center of the "mine" part is
            let youHitAMineWidth = ctx.measureText("you hit a mine!").width
            let mineWidth = ctx.measureText("mine").width
            let exclamationMarkWidth = ctx.measureText("!").width
            let mineCenter = youHitAMineWidth - exclamationMarkWidth - mineWidth/2 + 960 - youHitAMineWidth/2

            // and draw the type of mine
            ctx.font = Fonter.get(FontFamily.Righteous, 12)
            ctx.lineWidth = 3
            ctx.strokeText(`(${this.tileJustClicked.name})`, mineCenter, 295)
            ctx.fillText(`(${this.tileJustClicked.name})`, mineCenter, 295)

            // and draw other info...
            // this.tilesUncovered
            // this.minesCorrectlyFlagged
            // this.tilesIncorrectlyFlagged
            let gap = 20 / 2
            ctx.font = Fonter.get(FontFamily.Righteous, 35)
            ctx.lineWidth = 7

            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 2800) / 700
            ctx.textAlign = "right"
            ctx.strokeText("Tiles uncovered:", 960 - gap, 400)
            ctx.fillText("Tiles uncovered:", 960 - gap, 400)
            ctx.textAlign = "left"
            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 3400) / 700
            ctx.strokeText(this.tilesUncovered, 960 + gap, 400)
            ctx.fillText(this.tilesUncovered, 960 + gap, 400)

            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 3000) / 700
            ctx.textAlign = "right"
            ctx.strokeText("Mines correctly flagged:", 960 - gap, 445)
            ctx.fillText("Mines correctly flagged:", 960 - gap, 445)
            ctx.textAlign = "left"
            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 3600) / 700
            ctx.strokeText(this.minesCorrectlyFlagged, 960 + gap, 445)
            ctx.fillText(this.minesCorrectlyFlagged, 960 + gap, 445)

            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 3200) / 700
            ctx.textAlign = "right"
            ctx.strokeText("Tiles incorrectly flagged:", 960 - gap, 490)
            ctx.fillText("Tiles incorrectly flagged:", 960 - gap, 490)
            ctx.textAlign = "left"
            ctx.globalAlpha = Math.max(0, this.gameOverAnimationTimer - 3800) / 700
            ctx.strokeText(this.tilesIncorrectlyFlagged, 960 + gap, 490)
            ctx.fillText(this.tilesIncorrectlyFlagged, 960 + gap, 490)

            ctx.textAlign = "center"
            ctx.globalAlpha = 1
        }
    }

    drawPostAnimations() {
        // ctx.lineWidth = 10
        // ctx.textAlign = "left"
        // ctx.fillStyle = "#ffffff"
        // ctx.strokeStyle = "#000000"
        // ctx.font = Fonter.get("monospace", 15)
        // ctx.strokeText(`${this.animations.length} animations:`, 50, 120)
        // ctx.fillText(`${this.animations.length} animations:`, 50, 120)
        // let y = 150
        // for (let animation of this.animations) {
        //     let str = `Anim: ${animation.type} (${animation.timer.toPrecision(3)} / ${animation.length.toPrecision(3)})`
        //     ctx.strokeText(str, 50, y)
        //     ctx.fillText(str, 50, y)
        //     y += 30
        // }
        // ctx.textAlign = "center"
    }

    click(row, col) {
        if (GameHandler.state != GameState.Game) return

        let cell = this.grid[row][col]
        // shouldnt be able to click if the cell has been uncovered
        if (cell.state == CellState.Uncovered) return

        let origCellState = cell.state
        cell.state = CellState.Uncovered

        let tile = tileManager.getTile(cell.id)
        
        this.tileJustClicked = tile

        if (origCellState == CellState.Flagged) tile.onUnflagged(cell)

        // (BaseMineTile.onUncovered just runs sweeper.kablooey)
        tile.onUncovered(cell)

        // auto reveal
        if (!tile.disableAutoReveal) {
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

        console.log("you ded bruh")
        this.finishingChecks()
    }

    checkGameComplete() {
        // loop through all tiles and see if all tiles are revealed or mines
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let tile = this.grid[row][col]
                if (tileManager.getTile(tile.id).isMine || tile.state == CellState.Uncovered) {
                    continue
                }

                // if a covered tile is found...
                console.log("not all uncovered yet")
                return
            }
        }

        console.log("well done!!!!!")
        this.state == SweeperState.Detonated
        this.finishingChecks()
    }

    finishingChecks() {
        this.offsetXBeforeAnimation = this.offsetX
        this.offsetYBeforeAnimation = this.offsetY
        
        this.tilesUncovered = 0
        this.minesCorrectlyFlagged = 0
        this.tilesIncorrectlyFlagged = 0

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cell = this.grid[row][col]
                let tile = tileManager.getTile(cell.id)
                if (cell.state == CellState.Flagged && tile.isMine) {
                    this.minesCorrectlyFlagged++
                }

                if (cell.state == CellState.Flagged && !tile.isMine) {
                    this.tilesIncorrectlyFlagged++
                }

                if (cell.state == CellState.Uncovered) {
                    this.tilesUncovered++
                }
            }
        }
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
        if (this.state != SweeperState.Playing) return

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
