class SettingsScreen extends InitialisableClass {
    constructor() {
        super()
    }

    tick() {
        this.titleRot = Math.sin(GameHandler.gt / 470) * 0.08
    }

    draw() {
        ctx.fillStyle = "#d0d0d0"
        ctx.fillRect(0, 0, 1920, 1080)

        // title
        ctx.lineWidth = 7
        ctx.font = Fonter.get(FontFamily.Righteous, 70)
        ctx.fillStyle = "#000000"
        ctx.strokeStyle = "#ffffff"
        ctx.translate(230, 80)
        ctx.rotate(this.titleRot)
        ctx.translate(-230, -80)
        ctx.strokeText("settings", 230, 80)
        ctx.fillText("settings", 230, 80)
        ctx.translate(230, 80)
        ctx.rotate(-this.titleRot)
        ctx.translate(-230, -80)

        ctx.font = Fonter.get(FontFamily.Righteous, 40)
        ctx.translate(960, 540)
        ctx.rotate(GameHandler.gt / 500, GameHandler.gt / 500)
        ctx.translate(-960, -540)
        ctx.strokeText("settings page which definitely works", 960, 540)
        ctx.fillText("settings page which definitely works", 960, 540)
        ctx.translate(960, 540)
        ctx.rotate(-GameHandler.gt / 500, -GameHandler.gt / 500)
        ctx.translate(-960, -540)
    }
}
