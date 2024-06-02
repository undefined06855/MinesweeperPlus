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
        console.log("LoadHandler: loadGlobalAssets")
        await LoadHandler.loadGlobalAssets()
        console.log("LoadHandler: registerTiles")
        await LoadHandler.registerTiles()
        console.log("LoadHandler: finished!")
        LoadHandler.isAllLoaded = true
        
        console.log("LoadHandler: postClass")
        ClassCreator.postClass()
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
        let assets = await Utils.loadImageAssets(
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

        GlobalAssets.covered = assets[0]
        GlobalAssets.flagged = assets[1]
        GlobalAssets.flaggedWrong = assets[2]
        GlobalAssets.kablooey = assets[3]
        GlobalAssets.tile0 = assets[4]
        GlobalAssets.counterOuter = assets[5]
        GlobalAssets.counter = assets[6]
    }

    static hookError() {
        window.addEventListener("error", event => {
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            ctx.resetTransform()

            // ctx.fillStyle = "red"
            // ctx.fillRect(0, 0, 1920, 1080)
            ctx.fillStyle = "#000000"
            ctx.font = Fonter.get(FontFamily.Righteous, 40)
            ctx.fillText("There was an unrecoverable error!", 10, 50)
    
            ctx.font = Fonter.get(FontFamily.Righteous, 20)
    
            let splitFilename = event.filename.split("/")
            let fileName = splitFilename.pop()
            let pathName = splitFilename.pop()
            ctx.fillText(`${pathName}/${fileName} @ ${event.lineno}:${event.colno}`, 10, 80)
    
            let y = 110
            let x = 10
            let split = event.message.split(": ")
            split = split.map((chunk, i) => chunk += i == split.length - 1 ? "" : ":")
            for (let chunk of split) {
                ctx.fillText(chunk, x, y)
                y += 30
                x += 10
            }
    
            ctx.fillText("(Please screenshot this and send to @undefined06855!)", 10, 1060)
        })
    }
}