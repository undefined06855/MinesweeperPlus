let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

/** @type TileManager */
let tileManager
/** @type Sweeper */
let sweeper

/** @type number */
let dt

(async () => {
    tileManager = new TileManager()

    // register all tiles
    async function registerTiles() {
        await tileManager.register(GenericTile)
        await tileManager.register(MineTile)
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
    
    sweeper = new Sweeper(15, 15, 25)
    
    let dt
    let lastTime = performance.now()
    function loop() {
        ctx.clearRect(0, 0, 1920, 1080)

        dt = (performance.now() - lastTime)
        lastTime = performance.now()

        sweeper.tick(dt)
        sweeper.animations.forEach(anim => anim.tick(dt))

        sweeper.animations.forEach(anim => anim.preDraw())
        sweeper.draw()
        sweeper.animations.forEach(anim => anim.postDraw())

        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})()
