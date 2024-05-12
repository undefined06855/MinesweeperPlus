/** @enum */
let GameState = {
    Loading: -1,
    Title: 0
}

class GameHandler {
    static state = GameState.Loading

    // everything here runs on startup
    static init() {
        lastTime = performance.now()
        GameHandler.waitForLoadHandler()
    }

    static waitForLoadHandler() {
        if (LoadHandler.isAllLoaded) requestAnimationFrame(GameHandler.preMain)
        else requestAnimationFrame(GameHandler.waitForLoadHandler)
    }

    static preMain() {
        // classes here are created AFTER load
        title = new Title()
        sweeper = new Sweeper(15, 15, 25)

        requestAnimationFrame(GameHandler.main)
    }

    static main() {
        ctx.clearRect(0, 0, 1920, 1080)

        dt = (performance.now() - lastTime)
        lastTime = performance.now()

            sweeper.animations.forEach(anim => anim.tick(dt))

        sweeper.animations.forEach(anim => anim.preDraw())
        sweeper.draw()
        sweeper.animations.forEach(anim => anim.postDraw())

        requestAnimationFrame(GameHandler.main)
    }
}
