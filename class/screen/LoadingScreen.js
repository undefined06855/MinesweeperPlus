class LoadingScreen extends InitialisableClass {
    constructor() {
        super()
    }

    tick() {

    }

    draw() {
        ctx.fillStyle = "blue"
        ctx.fillRect(0, 0, 1920, 1080)
        ctx.fillStyle = "#ffffff"
        ctx.font = Fonter.get(FontFamily.Righteous, 20)
        ctx.fillText("Loading...", 500, 100)
    }
}
