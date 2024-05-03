class Ticker {
    constructor() {
        this.tickables = []
        this.drawables = []
        this.lastTime = performance.now()
    }

    registerTickable(tickableClass) {
        this.tickables.push(tickableClass)
    }

    registerDrawable(drawableClass) {
        this.drawables.push(drawableClass)
    }

    tick() {
        ctx.clearRect(0, 0, 960, 720)
        let dt = performance.now() - this.lastTime
        this.lastTime = performance.now()

        for (let tickable of this.tickables) tickable.tick(dt)
        for (let drawable of this.drawables) drawable.draw()
    }
}
