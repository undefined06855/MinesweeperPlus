class LoadHandler {
    static isAllLoaded = false

    static async loadAll() {
        console.log("LoadHandler: hookError")
        await LoadHandler.hookError()
        console.log("LoadHandler: loadGlobalAssetse")
        await LoadHandler.loadGlobalAssets()
        console.log("LoadHandler: registerTiles")
        await LoadHandler.registerTiles()
        console.log("LoadHandler: finished!")
        LoadHandler.isAllLoaded = true
    }

    static async registerTiles() {
        await tileManager.register(GenericTile)
        await tileManager.register(MineTile)
        await tileManager.register(MysteryTile)
        await tileManager.register(LyingTile)
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
            ctx.fillStyle = "red"
            ctx.fillRect(0, 0, 1920, 1080)
            ctx.fillStyle = "black"
            ctx.font = "40px monospace"
            ctx.fillText("There was an unrecoverable error!", 10, 50)
    
            ctx.font = "20px monospace"
    
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
    
            ctx.fillText("(Please screenshot this and send to @undefined0 (or @undefined06855 on some platforms)", 10, 1060)
        })
    }
}