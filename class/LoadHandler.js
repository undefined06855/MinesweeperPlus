/** @enum */
let LoadEvent = {
    HookerApplyHooks: 0,
    LoadHandlerCheckVitalClasses: 1,
    ClassCreatorPreClass: 2,
    LoadHandlerLoadFonts: 3,
    LoadHandlerLoadGlobalAssets: 4,
    LoadHandlerRegisterTiles: 5,
    LoadHandlerFinish: 6,
    ClassCreatorPostClass: 7
}

class LoadHandler {
    static isAllLoaded = false

    static async loadAll() {
        console.log("LoadHandler (on behalf of VanillaHooks): applyHooks")
        document.dispatchEvent(new Event(LoadEvent.HookerApplyHooks))
        Hooker.applyHooks()

        console.log("LoadHandler: checkVitalClasses")
        document.dispatchEvent(new Event(LoadEvent.LoadHandlerCheckVitalClasses))
        LoadHandler.checkVitalClasses()

        console.log("LoadHandler: preClass")
        document.dispatchEvent(new Event(LoadEvent.ClassCreatorPreClass))
        ClassCreator.preClass()

        console.log("LoadHandler: loadFonts")
        document.dispatchEvent(new Event(LoadEvent.loadFonts))
        await LoadHandler.loadFonts()
        console.log("LoadHandler: loadGlobalAssets")
        document.dispatchEvent(new Event(LoadEvent.LoadHandlerLoadGlobalAssets))
        await LoadHandler.loadGlobalAssets()
        console.log("LoadHandler: registerTiles")
        // document.dispatchEvent(new Event(LoadEvents.LoadHandlerRegisterTiles))
        await LoadHandler.registerTiles()
        console.log("LoadHandler: finished!")
        document.dispatchEvent(new Event(LoadEvent.LoadHandlerFinish))
        LoadHandler.isAllLoaded = true
        console.log("LoadHandler: postClass")
        document.dispatchEvent(new Event(LoadEvent.ClassCreatorPostClass))
        ClassCreator.postClass()
        LoadHandler.loadStage = Infinity
    }

    static async registerTiles() {
        await tileManager.register(GenericTile)
        await tileManager.register(MineTile)
        await tileManager.register(MysteryTile)
        await tileManager.register(LyingTile)
        document.dispatchEvent(new Event(LoadEvent.LoadHandlerRegisterTiles))
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

        // title assets
        let titleAssets = await Utils.loadImageAssets(
            "./assets/title/",
            [
                "goog-settings.png"
            ]
        )

        GlobalAssets.googIcons.settings = titleAssets[0]
    }

    // ok so i dont think this actually works
    // but like it's fine!! just ignore it
    static async loadFonts() {
        for (let family of Object.values(FontFamily)) {
            ctx.font = Fonter.get(family, 69)
            ctx.fillText("", 0, 0)
        }

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

    static checkVitalClasses() {
        try {[
            LoadingScreen,
            SettingsScreen,
            SetupScreen,
            Sweeper,
            Title,
            Anim,
            Cell,
            ClassCreator,
            EventHandler,
            Fonter,
            GameHandler,
            GlobalAssets,
            InitialisableClass,
            LoadHandler,
            LowPerformanceMode,
            OverlayDrawer,
            Settings,
            SetupPresetData,
            SweeperBGTile,
            TileManager,
            Transitioner,
            Utils,
            Hooker,
            BaseMineTile,
            BaseTile,
        ]} catch(error) {
            // uh oh
            setTimeout(() => {
                window.location.reload()
            }, 500)

            let className = error.toString().split(": ")[1].split(" is")[0]

            throw new Error(`Class ${className} not found! Reloading to try to fix issue...`)
        }
    }
}