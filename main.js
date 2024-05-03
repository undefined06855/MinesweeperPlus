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
    
    await registerTiles()
    
    sweeper = new Sweeper(9, 9, 10)
    sweeper.initTiles()
    
    registerTickers()
    
    function loop() {
        ticker.tick()
        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})()


