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

        this.animations = []
        
        this.tileInfoOverlayShowing = false
        this.customOverlayShowing = false

        this.presetData = [
            new SetupPresetData(9, 9, 10),
            new SetupPresetData(9, 9, 10),
            new SetupPresetData(16, 16, 40),
            new SetupPresetData(30, 16, 99)
        ]

        this.titleRot = 0

        this.preset = SetupPreset.Custom
        this.presetScaleX = 0
        this.presetScaleY = 0
        this.presetAnimationTimer = 0

        this.arrowRot = 0

        this.startSkewX = 0
        this.startSkewY = 0

        this.previewAnimationTimer = 0

        this.previewRotation = 0

        this.customPresetArrowOffset = 0

        this.bgRotation = 0

        this.currentlySelectedTile = null

        /** @type Array<number> */
        this.customPresetCustomiseButtonIDs = []

        // this.presetData.push(new SetupPresetData(69, 69, 1))
        // this.presetData.push(new SetupPresetData(69, 69, 1))
        // this.presetData.push(new SetupPresetData(69, 69, 1))
        // this.presetData.push(new SetupPresetData(69, 69, 1))
    }

    init() {
        let arrowButtonWidth = 30
        let arrowButtonHeight = 50

        let _this = this
        let customPresetButtonIDs = []
        let customPresetSetupButtonID = null
        function checkAddButtonForCustomSetup() {
            if (_this.preset == SetupPreset.Custom) {
                // open custom setup
                ctx.font = Fonter.get(FontFamily.Righteous, 60)
                customPresetSetupButtonID = EventHandler.registerButton(515 + ctx.measureText("settings").width/2 + 15, 230, 40, 40, () => {
                    _this.customOverlayShowing = true

                    ctx.font = Fonter.get(FontFamily.Righteous, 60)
                  
                    // close custom setup
                    customPresetButtonIDs.push(EventHandler.registerButton(0, 0, 1920, 1080, () => {
                        _this.customOverlayShowing = false
                        for (let id of customPresetButtonIDs) {
                            EventHandler.unregisterButton(id)
                        }
                    }, true))


                    // other buttons (calculations are duplicated from the ones down near the bottom of this)
                    // make sure to update both

                    let maxSize = 1080 * .6

                    let pad = 60
                    let right = 960 + maxSize/2 + pad
                    let bottom = 540 + maxSize/2 + pad

                    let vertButtonWidth = 40
                    let vertButtonHeight = 60
                    let horizButtonWidth = vertButtonHeight
                    let horizButtonHeight = vertButtonWidth

                    let vertArrowX = right - vertButtonWidth/2 - 5 //  is a magic number i pulled out my ass (i could calculate it from the font but ehh who wants that?)
                    let vertArrowUpY = 540 - 60 - vertButtonHeight/2
                    let vertArrowDownY = 540 + 60 - vertButtonHeight/2 - 5 // same with this one
                    let horizArrowY = bottom - horizButtonHeight/2
                    let horizArrowLeftX = 960 - 60 - horizButtonWidth/2
                    let horizArrowRightX = 960 + 60 - horizButtonWidth/2

                    let mineAdjY = 100 - horizButtonHeight/2
                    let mineAdjLeftX = 960 - ctx.measureText("mines:").width - 60 - horizButtonWidth/2
                    let mineAdjRightX = 960 + ctx.measureText(_this.getPresetData().mines).width + 60 - horizButtonWidth/2

                    function rejectAnim() {
                        _this.animations.push(new Anim(AnimType.Shake, 40, 180, _this.animations))
                    }

                    function checkMineCount(vibrate = false) {
                        if (_this.getPresetData().mines < 1) {
                            _this.presetData[SetupPreset.Custom].mines = 1
                            if (vibrate) rejectAnim()
                            return
                        }

                        if (_this.getPresetData().mines > (_this.getPresetData().width * _this.getPresetData().height - 5)) {
                            // too many mines (5 empty spaces is the arbitrary maximum set here)
                            let newAmount = _this.getPresetData().width * _this.getPresetData().height - 5
                            if (newAmount < 1) newAmount = 1
                            _this.presetData[SetupPreset.Custom].mines = newAmount
                            if (vibrate) rejectAnim()
                            return
                        }
                    }
                    
                    customPresetButtonIDs.push(EventHandler.registerButton(vertArrowX, vertArrowUpY, vertButtonWidth, vertButtonHeight, () => {
                        // vertical up
                        _this.presetData[SetupPreset.Custom].height++
                        if (_this.getPresetData().height > 99) {
                            _this.presetData[SetupPreset.Custom].height = 99
                            rejectAnim()
                            return
                        }
                        checkMineCount()
                    }))

                    customPresetButtonIDs.push(EventHandler.registerButton(vertArrowX, vertArrowDownY, vertButtonWidth, vertButtonHeight, () => {
                        // vertical down
                        _this.presetData[SetupPreset.Custom].height--
                        if (_this.getPresetData().height < 1) {
                            _this.presetData[SetupPreset.Custom].height = 1
                            rejectAnim()
                            return
                        }
                        checkMineCount()
                    }))

                    customPresetButtonIDs.push(EventHandler.registerButton(horizArrowLeftX, horizArrowY, horizButtonWidth, horizButtonHeight, () => {
                        // horizonal left
                        _this.presetData[SetupPreset.Custom].width--
                        if (_this.getPresetData().width < 1) {
                            // uh oh
                            _this.presetData[SetupPreset.Custom].width = 1
                            rejectAnim()
                            return
                        }
                        checkMineCount()
                    }))

                    customPresetButtonIDs.push(EventHandler.registerButton(horizArrowRightX, horizArrowY, horizButtonWidth, horizButtonHeight, () => {
                        // horizonal right
                        _this.presetData[SetupPreset.Custom].width++
                        if (_this.getPresetData().width > 99) {
                            _this.presetData[SetupPreset.Custom].width = 99
                            rejectAnim()
                            return
                        }
                        checkMineCount()
                    }))

                    customPresetButtonIDs.push(EventHandler.registerButton(mineAdjLeftX, mineAdjY, horizButtonWidth, horizButtonHeight, () => {
                        // mines subtract
                        _this.presetData[SetupPreset.Custom].mines--
                        checkMineCount(true)
                    }))

                    customPresetButtonIDs.push(EventHandler.registerButton(mineAdjRightX, mineAdjY, horizButtonWidth, horizButtonHeight, () => {
                        // mines add
                        _this.presetData[SetupPreset.Custom].mines++
                        checkMineCount(true)
                    }))
                })
            } else {
                EventHandler.unregisterButton(customPresetSetupButtonID)
            }
        }

        checkAddButtonForCustomSetup()

        // right
        EventHandler.registerButton(1160 - arrowButtonWidth/2, 155 - arrowButtonHeight/2, arrowButtonWidth, arrowButtonHeight, () => {
            this.preset++
            if (this.preset > this.presetData.length - 1) this.preset = 0
            checkAddButtonForCustomSetup()
        })

        // left
        EventHandler.registerButton(760 - arrowButtonWidth/2, 155 - arrowButtonHeight/2, arrowButtonWidth, arrowButtonHeight, () => {
            this.preset--
            if (this.preset < 0) this.preset = this.presetData.length - 1
            checkAddButtonForCustomSetup()
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
        ctx.font = Fonter.get(FontFamily.Righteous, 30) // so ctx.meaureText is correct
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

            let buttonX = x - (ctx.measureText(tile.name).width / 2) - 30
            let buttonY = y - 12

            // and register buttons
            EventHandler.registerButton(buttonX, buttonY, ctx.measureText(tile.name).width + 30, 24, () => {
                this.currentlySelectedTile = tile
                this.tileInfoOverlayShowing = true

                let exitOverlayButtonID

                // button to exit overlay
                exitOverlayButtonID = EventHandler.registerButton(0, 0, 1920, 1080, () => {
                    this.tileInfoOverlayShowing = false
                    EventHandler.unregisterButton(exitOverlayButtonID)
                }, true)
            })
        }
    }

    tick() {
        this.previewAnimationTimer += dt
        this.titleRot = Math.sin(GameHandler.gt / 470) * 0.08
        this.arrowRot = Math.cos(GameHandler.gt / 480) * 0.1
        this.presetScaleX = Math.sin(GameHandler.gt / (500 - this.preset * 5)) / (9 - this.preset*1.5) + 1
        this.presetScaleY = Math.cos(GameHandler.gt / (500 - this.preset * 5)) / (9 - this.preset*1.5) + 1
        this.startSkewX = Math.sin(GameHandler.gt / 500) * 0.1
        this.startSkewY = Math.sin(GameHandler.gt / 500) * 0.1
        this.previewRotation = Math.sin(GameHandler.gt / 500) * 0.085
        this.customPresetArrowOffset = Math.sin(GameHandler.gt / 400) * 6

        // make sure it always rotates in the same direction
        this.bgRotation = Math.sin(GameHandler.gt / 8600) * 2
    }

    draw() {
        // bg
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, 1920, 1080)

        let _this = this
        let squares = Math.max(_this.getPresetData().width, _this.getPresetData().height)
        let sqw = 1920 / squares
        let sqh = 1080 / squares

        function drawBGStep(step) {
            let scale = (5.5 - step / 7) * 0.6
            ctx.globalAlpha = 1 - (step / 10)

            ctx.translate(960, 540)
            ctx.scale(scale, scale)
            ctx.rotate(_this.bgRotation * step)
            ctx.translate(-960, -540)
            for (let x = 0; x < squares; x++) {
                for (let y = 0; y < squares; y++) {
                    ctx.drawImage(GlobalAssets.tile0, x * sqw, y * sqh, sqw, sqh)
                }
            }
            ctx.translate(960, 540)
            ctx.scale(1/scale, 1/scale)
            ctx.rotate(-_this.bgRotation * step)
            ctx.translate(-960, -540)
        }

__HIPERFORMANCE(() => {
        for (let i = 1; i < 10; i++) {
            drawBGStep(i)
        }
})

__LOPERFORMANCE(() => {
        drawBGStep(3)
        drawBGStep(5)
        drawBGStep(7)
        drawBGStep(9)
})

        ctx.globalAlpha = 1



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
        ctx.strokeText("difficulty preset:", 960, 100)
        ctx.fillText("difficulty preset:", 960, 100)

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

        // START!!!!!!!!!!!!!!!
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

        // draw size
        ctx.textAlign = "right"
        let width = this.getPresetData().width
        let height = this.getPresetData().height
        let widthWidth = ctx.measureText(width).width
        let xWidth = ctx.measureText("\u00d7").width
        let margin = ctx.measureText(" ").width // margin around the x
        let y = 350
        let widthX = 760
        let xX = widthX - widthWidth - margin
        let heightX = xX - xWidth - margin
        ctx.strokeText(width, widthX, y)
        ctx.fillText(width, widthX, y)
        ctx.strokeText("\u00d7", xX, y)
        ctx.fillText("\u00d7", xX, y)
        ctx.strokeText(height, heightX, y)
        ctx.fillText(height, heightX, y)


        ctx.strokeText(this.getPresetData().mines, 760, 410)
        ctx.fillText(this.getPresetData().mines, 760, 410)

        if (this.preset == SetupPreset.Custom) {
            ctx.font = Fonter.get(FontFamily.Righteous, 60)
            // draw settings icon (https://stackoverflow.com/a/28416298)
            let ox = 515 + ctx.measureText("settings").width/2 + 15
            let oy = 230
            ctx.filter = "invert(1)"
            for (let offset of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
                let x = offset[0] * 3 + ox
                let y = offset[1] * 3 + oy
                ctx.drawImage(GlobalAssets.googIcons.tune, x, y, 40, 40)
            }
            ctx.filter = "none"
            ctx.drawImage(GlobalAssets.googIcons.tune, ox, oy, 40, 40)
        }

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

        if (this.tileInfoOverlayShowing || this.customOverlayShowing) {
            // draw background to darken everything else
            ctx.fillStyle = "#000000be"
            ctx.fillRect(0, 0, 1920, 1080)
        }

        if (this.tileInfoOverlayShowing) {
            // draw overlay
            ctx.fillStyle = "#000000"
            ctx.font = Fonter.get(FontFamily.Righteous, 60)
            // capitalise the name
            let fixedName = this.currentlySelectedTile.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
            ctx.strokeText(fixedName, 960, 200)
            ctx.fillText(fixedName, 960, 200)
 
            // draw the icon twice, once blurred, once not
            for (let i = 0; i < 2; i++) {
__HIPERFORMANCE(() => {
                if (i == 0) ctx.filter = "blur(50px)"
})
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
                ctx.filter = "none"
            }

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

        if (this.customOverlayShowing) {
            ctx.fillStyle = "#000000"
            ctx.strokeStyle = "#ffffff"
            ctx.font = Fonter.get(FontFamily.Righteous, 60)

            // draw grid
            let maxSize = 1080 * .6
            let largestSize = Math.max(this.getPresetData().width, this.getPresetData().height)
            let tileSize = maxSize / largestSize
            let startPosX = 960 - (this.getPresetData().width * tileSize / 2)
            let startPosY = 540 - (this.getPresetData().height * tileSize / 2)
            let remainingMinesToDraw = this.getPresetData().mines
            for (let x = 0; x < this.getPresetData().width; x++) {
                for (let y = 0; y < this.getPresetData().height; y++) {
                    let actualX = x * tileSize + startPosX
                    let actualY = y * tileSize + startPosY
                    ctx.drawImage(remainingMinesToDraw > 0 ? MineTile.mineImage : GlobalAssets.covered, actualX, actualY, tileSize, tileSize)
                    remainingMinesToDraw--
                }
            }

            // labels
            let pad = 60
            let right = 960 + maxSize/2 + pad
            let bottom = 540 + maxSize/2 + pad

            ctx.strokeText(this.getPresetData().height, right, 540)
            ctx.fillText(this.getPresetData().height, right, 540)

            ctx.strokeText(this.getPresetData().width, 960, bottom)
            ctx.fillText(this.getPresetData().width, 960, bottom)

            // then draw the arrows
            right -= 5 //  is a magic number i pulled out my ass (i could calculate it from the font but ehh who wants that?)
            let vertArrowUpY = 540 - 60 - this.customPresetArrowOffset
            let vertArrowDownY = 540 + 60 + this.customPresetArrowOffset - 5 // same with this one
            
            // rotation is so ugly :broken_heart: but oh well
            ctx.translate(right, vertArrowUpY)
            ctx.rotate(1.5708) // 90deg in rad
            ctx.translate(-right, -vertArrowUpY)
            ctx.strokeText("<", right, vertArrowUpY)
            ctx.fillText("<", right, vertArrowUpY)
            ctx.translate(right, vertArrowUpY)
            ctx.rotate(-1.5708) // 90deg in rad
            ctx.translate(-right, -vertArrowUpY)

            ctx.translate(right, vertArrowDownY)
            ctx.rotate(1.5708) // 90deg in rad
            ctx.translate(-right, -vertArrowDownY)
            ctx.strokeText(">", right, vertArrowDownY)
            ctx.fillText(">", right, vertArrowDownY)
            ctx.translate(right, vertArrowDownY)
            ctx.rotate(-1.5708) // 90deg in rad
            ctx.translate(-right, -vertArrowDownY)

            let horizArrowLeftX = 960 - 60 - this.customPresetArrowOffset
            let horizArrowRightX = 960 + 60 + this.customPresetArrowOffset

            ctx.strokeText("<", horizArrowLeftX, bottom)
            ctx.fillText("<", horizArrowLeftX, bottom)

            ctx.strokeText(">", horizArrowRightX, bottom)
            ctx.fillText(">", horizArrowRightX, bottom)

            right += 5


            // mine count

            let gap = 10
            ctx.textAlign = "right"
            ctx.strokeText("mines:", 960 - gap, 100)
            ctx.fillText("mines:", 960  - gap, 100)

            ctx.textAlign = "left"
            ctx.strokeText(this.getPresetData().mines, 960 + gap, 100)
            ctx.fillText(this.getPresetData().mines, 960 + gap, 100)

            ctx.textAlign = "center"
            let before = ctx.font
            let before2 = ctx.lineWidth
            ctx.lineWidth = 4
            let percent = "(" + (this.getPresetData().mines / (this.getPresetData().width * this.getPresetData().height) * 100).toString().split(".")[0] + "%)"
            let percentX = ctx.measureText(this.getPresetData().mines).width / 2 + 960 + gap
            ctx.font = Fonter.get(FontFamily.Righteous, 20)
            ctx.strokeText(percent, percentX, 140)
            ctx.fillText(percent, percentX, 140)
            ctx.font = before
            ctx.lineWidth = before2


            ctx.strokeText("<", 960 - ctx.measureText("mines:").width - 60 - this.customPresetArrowOffset, 100)
            ctx.fillText("<", 960 - ctx.measureText("mines:").width - 60 - this.customPresetArrowOffset, 100)

            ctx.strokeText(">", 960 + ctx.measureText(this.getPresetData().mines).width + 60 + this.customPresetArrowOffset, 100)
            ctx.fillText(">", 960 + ctx.measureText(this.getPresetData().mines).width + 60 + this.customPresetArrowOffset, 100)

            // Utils.drawLineHoriz(bottom)
            // Utils.drawLineVert(right)

            // Utils.drawLineVert(startPosX)
            // Utils.drawLineVert(right)

            // Utils.drawLineHoriz(startPosY)
            // Utils.drawLineHoriz(bottom)

            // Utils.drawLineVert(960 - maxSize / 2, "green")
            // Utils.drawLineVert(960 + maxSize / 2, "green")
            // Utils.drawLineHoriz(540 - maxSize / 2, "green")
            // Utils.drawLineHoriz(540 + maxSize / 2, "green")
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
