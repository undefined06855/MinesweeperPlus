/** @enum */
let SetupPreset = {
    Custom: 0,
    Easy: 1,
    Medium: 2,
    Hard: 3
}

class SetupScreen extends InitialisableClass {
    constructor() {
        super()
        
        this.overlayShowing = false

        this.presetData = [
            new SetupPresetData(69, 420, "skibidi TOILET"),
            new SetupPresetData(9, 9, 10),
            new SetupPresetData(16, 16, 40),
            new SetupPresetData(30, 16, 99)
        ]

        this.titleRot = 0
        this.gradientPattern = null

        this.preset = SetupPreset.Medium
        this.presetScaleX = 0
        this.presetScaleY = 0
        this.presetAnimationTimer = 0

        this.arrowRot = 0

        this.startSkewX = 0
        this.startSkewY = 0

        this.previewAnimationTimer = 0

        this.previewRotation = 0

        this.currentlySelectedTile = null
    }

    init() {
        let arrowButtonWidth = 30
        let arrowButtonHeight = 50

        // right
        EventHandler.registerButton(1160 - arrowButtonWidth/2, 155 - arrowButtonHeight/2, arrowButtonWidth, arrowButtonHeight, () => {
            this.preset++
            if (this.preset > 3) this.preset = 0
        })

        // left
        EventHandler.registerButton(760 - arrowButtonWidth/2, 155 - arrowButtonHeight/2, arrowButtonWidth, arrowButtonHeight, () => {
            this.preset--
            if (this.preset < 0) this.preset = 3
        })

        // start
        EventHandler.registerButton(880, 930, 160, 60, () => {
            if (Transitioner.to(GameState.Game)) {
                let data = this.getPresetData()
                sweeper = new Sweeper(data.width, data.height, data.mines)
                EventHandler.unregisterAllButtons()
            }
        })

        // register buttons for mines and tiles (basically a copy of drawing without the drawing)
        let mineYPos = 0
        let tileYPos = 0
        for (let tile of tileManager.tiles) {
            let x, y
            if (tile.isMine) {
                x = 1205
                y = mineYPos * 40 + 370
                mineYPos++
            } else {
                x = 1605
                y = tileYPos * 40 + 370
                tileYPos++
            }

            let buttonX = x - (ctx.measureText(tile.name).width / 2) - 60
            let buttonY = y - 12

            // and register buttons
            EventHandler.registerButton(buttonX, buttonY, ctx.measureText(tile.name).width + 90, 24, () => {
                this.currentlySelectedTile = tile
                this.overlayShowing = true

                let exitOverlayButtonID

                // button to exit overlay
                exitOverlayButtonID = EventHandler.registerButton(0, 0, 1920, 1080, () => {
                    this.overlayShowing = false
                    EventHandler.unregisterButton(exitOverlayButtonID)
                }, true)
            })
        }
    }

    tick() {
        this.previewAnimationTimer += dt
        this.titleRot = Math.sin(performance.now() / 470) * 0.08
        this.arrowRot = Math.cos(performance.now() / 480) * 0.1
        this.presetScaleX = Math.sin(performance.now() / (500 - this.preset * 5)) / (9 - this.preset*1.5) + 1
        this.presetScaleY = Math.cos(performance.now() / (500 - this.preset * 5)) / (9 - this.preset*1.5) + 1
        this.startSkewX = Math.sin(performance.now() / 500) * 0.1
        this.startSkewY = Math.sin(performance.now() / 500) * 0.1
        this.previewRotation = Math.sin(performance.now() / 500) * 0.085
        
        let size = 200
        let patternWidth = Math.sin(performance.now() / 500) * size + size*2
        let patternHeight = Math.cos(performance.now() / 500) * size + size*2

        let patternCanvas = new OffscreenCanvas(patternWidth, patternHeight)
        let ptx = patternCanvas.getContext("2d")

        let gradientVertical = ptx.createLinearGradient(0, 0, patternWidth, 0)
        gradientVertical.addColorStop(0.3, "#f0f0f000")
        gradientVertical.addColorStop(0.5, "#f0f0f0")
        gradientVertical.addColorStop(0.7, "#f0f0f000")
    
        let gradientHorizontal = ptx.createLinearGradient(0, 0, 0, patternHeight)
        gradientHorizontal.addColorStop(0.3, "#f0f0f000")
        gradientHorizontal.addColorStop(0.5, "#f0f0f0")
        gradientHorizontal.addColorStop(0.7, "#f0f0f000")

        ptx.fillStyle = gradientVertical
        ptx.fillRect(0, 0, patternWidth, patternHeight)
        ptx.fillStyle = gradientHorizontal
        ptx.fillRect(0, 0, patternWidth, patternHeight)
        this.gradientPattern = ctx.createPattern(patternCanvas, "repeat")
    }

    draw() {
        // bg
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, 1920, 1080)
        ctx.fillStyle = this.gradientPattern
        ctx.fillRect(0, 0, 1920, 1080)

        // round rect
        ctx.fillStyle = "#4b4b4b4b"
        ctx.strokeStyle = "#0000006e"
        ctx.beginPath()
        ctx.roundRect(70, 60, 1780, 960, 50)
        ctx.fill()
        ctx.stroke()

        // LINE
        ctx.beginPath()
        ctx.moveTo(960, 230)
        ctx.lineTo(960, 900)
        ctx.stroke()

        // title
        ctx.lineWidth = 7
        ctx.font = Fonter.get(FontFamily.Righteous, 70)
        ctx.fillStyle = "#000000"
        ctx.strokeStyle = "#ffffff"
        ctx.translate(230, 80)
        ctx.rotate(this.titleRot)
        ctx.translate(-230, -80)
        ctx.strokeText("game setup", 230, 80)
        ctx.fillText("game setup", 230, 80)
        ctx.translate(230, 80)
        ctx.rotate(-this.titleRot)
        ctx.translate(-230, -80)

        // "difficulty":
        ctx.font = Fonter.get(FontFamily.Righteous, 30)
        ctx.strokeText("difficulty:", 960, 100)
        ctx.fillText("difficulty:", 960, 100)

        // preset type
        ctx.font = Fonter.get(FontFamily.Righteous, 60)
        ctx.strokeStyle = this.getPresetColor()
        ctx.translate(960, 160)
        ctx.scale(this.presetScaleX, this.presetScaleY)
        ctx.translate(-960, -160)
        ctx.strokeText(this.getPresetString(), 960, 160)
        ctx.fillText(this.getPresetString(), 960, 160)
        ctx.translate(960, 160)
        ctx.scale(1 / this.presetScaleX, 1 / this.presetScaleY)
        ctx.translate(-960, -160)

        // arrows
        ctx.strokeStyle = "#ffffff"
        ctx.translate(1160, 160)
        ctx.rotate(this.arrowRot)
        ctx.translate(-1160, -160)
        ctx.strokeText(">", 1160, 160)
        ctx.fillText(">", 1160, 160)
        ctx.translate(1160, 160)
        ctx.rotate(-this.arrowRot)
        ctx.translate(-1160, -160)

        ctx.translate(760, 160)
        ctx.rotate(this.arrowRot)
        ctx.translate(-760, -160)
        ctx.strokeText("<", 760, 160)
        ctx.fillText("<", 760, 160)
        ctx.translate(760, 160)
        ctx.rotate(-this.arrowRot)
        ctx.translate(-760, -160)

        // GO!!!!!!!!!
        ctx.font = Fonter.get(FontFamily.Righteous, 60)
        ctx.translate(960, 960)
        ctx.save()
        ctx.transform(1, this.startSkewY, this.startSkewX, 1, 0, 0)
        ctx.translate(-960, -960)
        ctx.strokeText("Start!", 960, 960)
        ctx.fillText("Start!", 960, 960)
        ctx.translate(960, 960)
        ctx.restore()
        ctx.translate(-960, -960)

        // captions
        ctx.font = Fonter.get(FontFamily.Righteous, 60)
        ctx.strokeText("mines", 1405, 250)
        ctx.fillText("mines", 1405, 250)

        ctx.strokeText("settings", 515, 250)
        ctx.fillText("settings", 515, 250)
        

        if (this.preset == SetupPreset.Custom) ctx.fillStyle = "#000000"
        else ctx.fillStyle = "#474747"

        // left labels
        ctx.font = Fonter.get(FontFamily.Righteous, 50)
        ctx.textAlign = "left"
        ctx.strokeText("size:", 200, 350)
        ctx.fillText("size:", 200, 350)

        ctx.strokeText("mines:", 200, 410)
        ctx.fillText("mines:", 200, 410)

        ctx.textAlign = "right"
        let sizeString = `${this.getPresetData().width}×${this.getPresetData().height}`
        ctx.strokeText(sizeString, 760, 350)
        ctx.fillText(sizeString, 760, 350)

        ctx.strokeText(this.getPresetData().mines, 760, 410)
        ctx.fillText(this.getPresetData().mines, 760, 410)

        // right labels
        ctx.fillStyle = "#000000"
        ctx.textAlign = "center"
        ctx.font = Fonter.get(FontFamily.Righteous, 40)

        ctx.strokeText(`mine types: ${tileManager.getMineCount()}`, 1205, 320)
        ctx.fillText(`mine types: ${tileManager.getMineCount()}`, 1205, 320)

        ctx.strokeText(`tile types: ${tileManager.getNonBombCount()}`, 1605, 320)
        ctx.fillText(`tile types: ${tileManager.getNonBombCount()}`, 1605, 320)

        // draw the tiles
        ctx.font = Fonter.get(FontFamily.Righteous, 30)
        let mineYPos = 0
        let tileYPos = 0
        for (let tile of tileManager.tiles) {
            let x, y
            if (tile.isMine) {
                x = 1205
                y = mineYPos * 40 + 370
                mineYPos++
            } else {
                x = 1605
                y = tileYPos * 40 + 370
                tileYPos++
            }

            let previewX = x - (ctx.measureText(tile.name).width / 2) - 30
            let previewY = y - 12

            ctx.translate(previewX, previewY)
            tile.drawPreview(~~(this.previewAnimationTimer / 900), 24, 24)
            ctx.translate(-previewX, -previewY)

            ctx.strokeText(tile.name, x, y)
            ctx.fillText(tile.name, x, y)
        }

        if (this.overlayShowing) {
            // draw background to darken everything else
            ctx.fillStyle = "#000000be"
            ctx.fillRect(0, 0, 1920, 1080)

            // draw overlay
            ctx.fillStyle = "#000000"
            ctx.font = Fonter.get(FontFamily.Righteous, 60)
            // capitalise the name
            let fixedName = this.currentlySelectedTile.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
            ctx.strokeText(fixedName, 960, 200)
            ctx.fillText(fixedName, 960, 200)
 
            let x = 480
            let y = 390
            let size = 300

            ctx.translate(x + size/2, y + size/2)
            ctx.rotate(this.previewRotation)
            ctx.translate(-x - size/2, -y - size/2)

            ctx.translate(x, y)
            this.currentlySelectedTile.drawPreview(~~(this.previewAnimationTimer / 900), size, size)
            ctx.translate(-x, -y)

            ctx.translate(x + size/2, y + size/2)
            ctx.rotate(-this.previewRotation)
            ctx.translate(-x - size/2, -y - size/2)

            ctx.font = Fonter.get(FontFamily.Righteous, 40)
            ctx.textAlign = "left"
            let textStartY = 540 - this.currentlySelectedTile.description.length * (45 / 2)
            let i = 0
            for (let line of this.currentlySelectedTile.description) {
                ctx.strokeText(line, 900, textStartY + 45*i)
                ctx.fillText(line, 900, textStartY + 45*i)
                i++
            }

            ctx.textAlign = "center"
        }
    }

    getPresetString() {
        switch(this.preset) {
            case SetupPreset.Custom: return "custom"
            case SetupPreset.Easy: return "easy"
            case SetupPreset.Medium: return "medium"
            case SetupPreset.Hard: return "hard"
        }
    }

    getPresetColor() {
        switch(this.preset) {
            case SetupPreset.Custom: return "#3768f0"
            case SetupPreset.Easy: return "#46f037"
            case SetupPreset.Medium: return "#f0bf37"
            case SetupPreset.Hard: return "#f04d37"
        }
    }

    getPresetData() {
        return this.presetData[this.preset]
    }
}
