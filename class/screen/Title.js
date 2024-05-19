class Title extends InitialisableClass {
    constructor() {
        super()

        this.y = 0
        this.scrollY = 0
        this.plusRotation = 0

        this.animationTimer = 0
        this.rawAnimationTimer = 0

        /** @type Array<Array<typeof BaseTile>> */
        this.tiles = []
        /** @type Array<Array<number>> */
        this.tileIndexes = []

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
        let indexCol = []
        for (let i = 0; i < this.width; i++) {
            this.index++
            let tileIndex = tileManager.getTileIDForTitle()
            col.push(tileManager.getTile(tileIndex))

            indexCol.push(~~(Math.random() * 10_000))
        }

        this.tiles.unshift(col)
        this.tileIndexes.unshift(indexCol)
    }

    tick() {
        this.y = Math.sin(performance.now() / 350) * 25
        this.plusRotation = Math.sin(performance.now() / 500) * 0.15
        this.scrollY += dt / 40

        if (this.scrollY >= 0) {
            this.scrollY = -this.tileSize
            this.tiles.pop()
            this.generateRow()
        }

        this.rawAnimationTimer += dt
        if (this.rawAnimationTimer > 200)
            this.animationTimer += dt

        // slowly make rotation / movement bigger and bigger
        this.movementMultiplier += dt * 0.000003
    }
    
    draw() {
        // background
        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                let tile = this.tiles[row][col]
                let index = this.tileIndexes[row][col]

                ctx.translate(col * this.tileSize, row * this.tileSize + this.scrollY)
                tile.drawPreview(index, this.tileSize, this.tileSize)
                ctx.translate(-col * this.tileSize, -row * this.tileSize - this.scrollY)
            }
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
