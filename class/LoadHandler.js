class LoadHandler {
    static isAllLoaded = false

    static async loadAll() {
        console.log("LoadHandler: preClass")
        ClassCreator.preClass()

        // load fonts (not really priority, so isn't factored into load time)
        for (let family of Object.values(FontFamily)) {
            ctx.font = Fonter.get(family, 69)
            ctx.fillText("", 0, 0)
        }

        console.log("LoadHandler: hookError")
        LoadHandler.hookError()
        console.log("LoadHandler: loadFonts")
        await LoadHandler.loadFonts()
        console.log("LoadHandler: loadGlobalAssets")
        await LoadHandler.loadGlobalAssets()
        console.log("LoadHandler: registerTiles")
        await LoadHandler.registerTiles()
        console.log("LoadHandler: finished!")
        LoadHandler.isAllLoaded = true
        console.log("LoadHandler: postClass")
        ClassCreator.postClass()
        LoadHandler.loadStage = Infinity
    }

    static async registerTiles() {
        await tileManager.register(GenericTile)
        await tileManager.register(MineTile)
        await tileManager.register(MysteryTile)
        await tileManager.register(LyingTile)
        // await tileManager.register(TestTile)
        tileManager.finishRegister()
    }

    static async loadGlobalAssets() {
        // game assets
        let gameAssets = await Utils.loadImageAssets(
            "./assets/game/",
            [
                "tiles/covered.png",
                "tiles/flagged.png",
                "tiles/flaggedWrong.png",
                "tiles/kablooey.png",
                "tiles/0.png",
                "ui/counter-outer.png",
                "ui/counter.png",
            ]
        )

        GlobalAssets.covered = gameAssets[0]
        GlobalAssets.flagged = gameAssets[1]
        GlobalAssets.flaggedWrong = gameAssets[2]
        GlobalAssets.kablooey = gameAssets[3]
        GlobalAssets.tile0 = gameAssets[4]
        GlobalAssets.counterOuter = gameAssets[5]
        GlobalAssets.counter = gameAssets[6]

        // setup assets
        let setupAssets = await Utils.loadImageAssets(
            "./assets/setup/",
            [
                "goog-tune.png",
            ]
        )

        GlobalAssets.googIcons.tune = setupAssets[0]
    }

    // ok so i dont think this actually works
    // but like it's fine!! just ignore it
    static async loadFonts() {
        return new Promise(resolve => {
            function waitTick() {
                // check if all fonts are loaded yet
                for (let font of Object.values(FontFamily)) {
                    if (!document.fonts.check(Fonter.get(font, 30))) {
                        requestAnimationFrame(waitTick)
                        return
                    }
                }

                resolve()
            }

            waitTick()
        })
    }

    static hookError() {
        window.addEventListener("error", event => {
            GameHandler.hasErrored = true
            EventHandler.unregisterAllButtons()
            EventHandler.unregisterAllMouseMoves()
            EventHandler.unregisterAllScrolls()
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            ctx.resetTransform()

            // ctx.fillStyle = "red"
            // ctx.fillRect(0, 0, 1920, 1080)
            ctx.fillStyle = "#000000"
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 5
            ctx.font = Fonter.get(FontFamily.Righteous, 40)
            ctx.strokeText("There was an unrecoverable error!", 10, 50)
            ctx.fillText("There was an unrecoverable error!", 10, 50)
    
            ctx.font = Fonter.get(FontFamily.Righteous, 20)
    
            let splitFilename = event.filename.split("/")
            let fileName = splitFilename.pop()
            let pathName = splitFilename.pop()
            ctx.strokeText(`${pathName}/${fileName} @ ${event.lineno}:${event.colno}`, 10, 80)
            ctx.fillText(`${pathName}/${fileName} @ ${event.lineno}:${event.colno}`, 10, 80)
    
            let y = 110
            let x = 10
            let split = event.message.split(": ")
            split = split.map((chunk, i) => chunk += i == split.length - 1 ? "" : ":")
            for (let chunk of split) {
                ctx.strokeText(chunk, x, y)
                ctx.fillText(chunk, x, y)
                y += 30
                x += 10
            }
    
            ctx.strokeText("(Please screenshot this and send to @undefined06855!)", 10, 1060)
            ctx.fillText("(Please screenshot this and send to @undefined06855!)", 10, 1060)
        })
    }
}