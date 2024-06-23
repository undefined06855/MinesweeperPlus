class TitleTile {
    /**
     * @param {typeof BaseTile} tile 
     * @param {number} index 
     */
    constructor(tile, index) {
        this.tile = tile
        this.index = index
        this.animationState = {
            tick: 0,
            isAnimating: false
        }
    }
}

class Title extends InitialisableClass {
    constructor() {
        super()

        /** @type Array<Anim> */
        this.animations = []

        this.hasShakenForTitle = false

        this.y = 0
        this.scrollY = 0
        this.plusRotation = 0

        this.animationTimer = 0
        this.rawAnimationTimer = 0

        /** @type Array<Array<TitleTile>> */
        this.tiles = []

        this.width = 40
        this.height = this.width * (9/16) + 1
        this.tileSize = 1920 / this.width
        
        // generate one more row than is needed
        for (let i = 0; i < this.height; i++) {
            this.generateRow()
        }

        this.scrollY = -this.tileSize

        this.movementMultiplier = 1
    }

    init() {
        EventHandler.registerButton(0, 0, 1920, 1080, () => {
            if (Transitioner.to(GameState.GameSetup, Transition.Fade, 1000))
                EventHandler.unregisterAllButtons()
        }, true)
    }

    generateRow() {
        let col = []
        for (let i = 0; i < this.width; i++) {
            this.index++
            let tileIndex = tileManager.getTileIDForTitle()
            col.push(new TitleTile(
                tileManager.getTile(tileIndex),
                ~~(Math.random() * 10_000)
            ))
        }

        this.tiles.unshift(col)
    }

    tick() {
        this.y = Math.sin(GameHandler.gt / 350) * 25
        this.plusRotation = Math.sin(GameHandler.gt / 500) * 0.15
        this.scrollY += dt / 40

        if (this.scrollY >= 0) {
            this.scrollY = -this.tileSize
            this.tiles.pop()
            this.generateRow()
        }

        if (Math.random() < 0.02 && this.animationTimer > 700) { // delay before bounces
            // bounce!
            // find random tile to bounce
            let row = ~~(Math.random() * this.height)
            let col = ~~(Math.random() * this.width)
            let tile = this.tiles[row][col]
            tile.animationState.isAnimating = true
            tile.animationState.tick = 0
        }

        // tick bouncing
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let tile = this.tiles[row][col]
                if (!tile.animationState.isAnimating) continue
                tile.animationState.tick += dt

                if (tile.animationState.tick > 1000) {
                    tile.animationState.isAnimating = false
                }
            }
        }

        if (this.animationTimer >= 500 && !this.hasShakenForTitle) {
            // shake!
            this.animations.push(new Anim(AnimType.Shake, 15, 200, this.animations))
            this.hasShakenForTitle = true
        }

        this.rawAnimationTimer += dt
        if (this.rawAnimationTimer > 200) // delay before everything appears
            this.animationTimer += dt

        // slowly make rotation / movement bigger and bigger
        this.movementMultiplier += dt * 0.000003
    }
    
    draw() {
        // background
        let lateRenderCallbacks = []
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let titleTile = this.tiles[row][col]

                let cx = col * this.tileSize + this.tileSize/2
                let cy = row * this.tileSize + this.tileSize/2 + this.scrollY

                let _this = this
                function renderThatTileShit() {
                    // https://www.desmos.com/calculator/fynmmcckrv
                    let scaleFunction = x => 0 - ((x - 500) / 500)**2 + 2

                    let scale = scaleFunction(titleTile.animationState.tick) * _this.movementMultiplier
                    if (titleTile.animationState.isAnimating) {
__HIPERFORMANCE(() => {
                        ctx.filter = "drop-shadow(0px 0px 15px #000000)"
})
                        ctx.translate(cx, cy)
                        ctx.scale(scale, scale)
                        ctx.translate(-cx, -cy)
                    }
    
                    ctx.translate(col * _this.tileSize, row * _this.tileSize + _this.scrollY)
                    titleTile.tile.drawPreview(titleTile.index, _this.tileSize, _this.tileSize)
                    ctx.translate(-col * _this.tileSize, -row * _this.tileSize - _this.scrollY)
    
                    if (titleTile.animationState.isAnimating) {
                        ctx.translate(cx, cy)
                        ctx.scale(1 / scale, 1 / scale)
                        ctx.translate(-cx, -cy)
                        ctx.filter = "none"
                    }
                }

                if (titleTile.animationState.isAnimating) lateRenderCallbacks.push(renderThatTileShit)
                else renderThatTileShit()
            }
        }

        for (let cb of lateRenderCallbacks) {
            cb()
        }

        // title (too much code here for what it does :despair:)
        ctx.fillStyle = "#000000"
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 15
        ctx.font = Fonter.get(FontFamily.Righteous, 120)
        let length = 500
        // https://www.desmos.com/calculator/gfnbdsdzka and https://www.desmos.com/calculator/8rke6lnz9u and https://www.desmos.com/calculator/kcxh1grkvd
        let scaleAnimationFunction = x => -4.8e-7 * x**3 + 60
        let rotationAnimationFunction = x => 1.28e-15 * x**6 - 20
        let alphaAnimationFunction = x => x < 50 ? 0 : 0.004 * x - 0.2
        if (this.animationTimer < length) {
            ctx.globalAlpha = alphaAnimationFunction(this.animationTimer)
            ctx.translate(960, 270)
            ctx.scale(scaleAnimationFunction(this.animationTimer), scaleAnimationFunction(this.animationTimer))
            ctx.rotate(rotationAnimationFunction(this.animationTimer) * (Math.PI / 180))
            ctx.translate(-960, -270)
        }
        ctx.strokeText("MINESWEEPER", 960, 270)
        ctx.fillText("MINESWEEPER", 960, 270)
        if (this.animationTimer < length) {
            ctx.translate(960, 270)
            ctx.scale(1 / scaleAnimationFunction(this.animationTimer), 1 / scaleAnimationFunction(this.animationTimer))
            ctx.rotate(-rotationAnimationFunction(this.animationTimer) * (Math.PI / 180))
            ctx.translate(-960, -270)
            ctx.globalAlpha = 1
        }


        ctx.lineWidth = 7
        ctx.font = Fonter.get(FontFamily.RockSalt, 30)

        // GET ROTATED idiot
        let plusAlphaAnimationFunction = x => x < 600 ? 0 : 0.002 * x - 1
        ctx.globalAlpha = plusAlphaAnimationFunction(this.animationTimer)
        ctx.translate(1380, 225)
        ctx.rotate(this.plusRotation * this.movementMultiplier)
        ctx.translate(-1380, -225)
        ctx.strokeText("plus", 1380, 225)
        ctx.fillText("plus", 1380, 225)
        ctx.translate(1380, 225)
        ctx.rotate(-this.plusRotation * this.movementMultiplier)
        ctx.translate(-1380, -225)
        ctx.globalAlpha = 1

        ctx.lineWidth = 10

        let everythingElseAlphaAnimationFunction = x => x < 1389 ? 0 : 0.0018 * x - 2.5
        ctx.globalAlpha = everythingElseAlphaAnimationFunction(this.animationTimer)

        ctx.font = Fonter.get(FontFamily.Righteous, 50)
        ctx.strokeText("click to play", 960, 500 + this.y * this.movementMultiplier)
        ctx.fillText("click to play", 960, 500 + this.y * this.movementMultiplier)

        ctx.lineWidth = 3
        ctx.font = Fonter.get(FontFamily.Righteous, 20)
        ctx.strokeText("(really, really beta build)", 960, 1060)
        ctx.fillText("(really, really beta build)", 960, 1060)

        ctx.globalAlpha = 1
    }
}
