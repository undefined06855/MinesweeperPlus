/** @enum */
let GameState = {
    Loading: -1,
    Title: 0,
    Game: 1,
    GameSetup: 2
}

class GameHandler {
    static state = GameState.Loading
    static speedMultiplier = 1
    static zoomOut = false

    // everything here runs on startup
    static init() {
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.textRendering = "optimizeLegibility"
        ctx.lineCap = "round"
        ctx.miterLimit = 0.0001 // make everything a bevel (fixes "plus" text on the title, and just makes the title look nice)
        ctx.lineJoin = "bevel"

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
        ctx.clearRect(0, 0, 1920, 1080)

        if (GameHandler.zoomOut) {
            ctx.scale(0.5, 0.5)
            ctx.translate(960, 540)
        }

        dt = (performance.now() - lastTime) * GameHandler.speedMultiplier
        lastTime = performance.now()

        Transitioner.tick()

        switch(GameHandler.state) {
            case GameState.Loading:
                loadingScreen.tryInit()
                loadingScreen.tick()
                loadingScreen.draw()
                break
            case GameState.Title:
                title.tryInit()
                title.tick()
                title.draw()
                break
            case GameState.GameSetup:
                setupScreen.tryInit()
                setupScreen.tick()
                setupScreen.draw()
                break
            case GameState.Game:
                sweeper.tryInit()
                sweeper.animations.forEach(anim => anim.tick())
                sweeper.animations.forEach(anim => anim.preDraw())
                sweeper.draw()
                sweeper.animations.forEach(anim => anim.postDraw())
                sweeper.drawUnanimated()
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
        EventHandler.draw()

        if (GameHandler.zoomOut) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 8
            ctx.strokeRect(0, 0, 1920, 1080)
    
            ctx.resetTransform()
        }

        requestAnimationFrame(GameHandler.main)
    }
}
