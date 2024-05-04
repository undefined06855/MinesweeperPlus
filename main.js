let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

/** @type Ticker */
let ticker
/** @type TileManager */
let tileManager
/** @type Sweeper */
let sweeper

(async () => {
    ticker = new Ticker()
    tileManager = new TileManager()

    // register all tiles
    async function registerTiles() {
        await tileManager.register(GenericTile)
        await tileManager.register(MineTile)
    }
    
    function registerTickers() {
        ticker.registerDrawable(sweeper)
    }

    async function loadGlobalAssets() {
        let assets = await Utils.loadImageAssets("./assets/game/", ["covered.png", "flagged.png", "flaggedWrong.png", "kablooey.png"])
        GlobalAssets.covered = assets[0]
        GlobalAssets.flagged = assets[1]
        GlobalAssets.flaggedWrong = assets[2]
        GlobalAssets.kablooey = assets[3]
    }
    
    await registerTiles()
    await loadGlobalAssets()
    
    sweeper = new Sweeper(9, 9, 10)
    sweeper.initTiles()
    
    registerTickers()
    
    function loop() {
        ticker.tick()
        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})()


