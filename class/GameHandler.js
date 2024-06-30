/** @enum */
let GameState = {
    Loading: -1,
    Title: 0,
    Game: 1,
    GameSetup: 2
}

class GameHandler {
    static state = GameState.Loading
    // static speedMultiplier = 1
    static gt = 0 // global timer
    static hasErrored = false

    // everything here runs on startup
    static init() {
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.textRendering = "optimizeLegibility"
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        
        lastTime = performance.now()
        GameHandler.waitForLoadHandler()
        requestAnimationFrame(GameHandler.main)
    }

    // runs parallel to `main`
    static waitForLoadHandler() {
        if (LoadHandler.isAllLoaded) Transitioner.to(GameState.Title)
        else requestAnimationFrame(GameHandler.waitForLoadHandler)
    }

    // Main game loop
    static main() {
        if (GameHandler.hasErrored) return
        // place after the zoom out to only clear shit inside the zoomed out area
        ctx.clearRect(0, 0, 1920, 1080)

        if (OverlayDrawer.flags.debug) {
            ctx.scale(0.5, 0.5)
            ctx.translate(960, 540)
        }

        dt = (performance.now() - lastTime)// * GameHandler.speedMultiplier
        lastTime = performance.now()

        GameHandler.gt += dt

        Transitioner.tick()

        switch(GameHandler.state) {
            case GameState.Loading:
                // if there was an error with loading these would fail
                try {
                    loadingScreen.tryInit()
                    loadingScreen.tick()
                    loadingScreen.draw()
                } catch(_) {}
                break
            case GameState.Title:
                title.tryInit()
                title.tick()
                title.animations.forEach(anim => anim.tick())
                title.animations.forEach(anim => anim.preDraw())
                title.draw()
                title.animations.forEach(anim => anim.postDraw())
                break
            case GameState.GameSetup:
                // believe it or not, setupscreen does have animations! try to find them...
                setupScreen.tryInit()
                setupScreen.tick()
                setupScreen.animations.forEach(anim => anim.tick())
                setupScreen.animations.forEach(anim => anim.preDraw())
                setupScreen.draw()
                setupScreen.animations.forEach(anim => anim.postDraw())
                break
            case GameState.Game:
                sweeper.tryInit()
                sweeper.tick()
                sweeper.animations.forEach(anim => anim.tick())
                sweeper.animations.forEach(anim => anim.preDraw())
                sweeper.draw()
                sweeper.animations.forEach(anim => anim.postDraw())
                sweeper.drawPostAnimations()
                break
            default:
                // probably shouldn't be hardcoded but whatever
                ctx.textAlign = "left"
                ctx.fillStyle = "#000000"
                ctx.fillRect(0, 0, 1920, 1080)
                ctx.fillStyle = "#ffffff"
                ctx.font = Fonter.get("monospace", "30")
                ctx.fillText("Unknown GameState", 40, 40)
                ctx.fillText("State: " + GameHandler.state, 40, 75)
                ctx.textAlign = "center"
        }

        Transitioner.draw()

        if (OverlayDrawer.flags.debug) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 8
            ctx.strokeRect(0, 0, 1920, 1080)
    
            ctx.resetTransform()
        }

        OverlayDrawer.draw()

        requestAnimationFrame(GameHandler.main)
    }
}
