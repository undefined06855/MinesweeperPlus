// this is basically all debug and beta shit
// can be removed in full release or whatever
class OverlayDrawer {
    /** @type OffscreenCanvas | undefined */
    static betaBuildCanvas = undefined
    static betaBuildString = "(really, really beta build)"
    static debugMemoryUsages = []
    static logs = []

    static draw() {
        if (Settings.settings.debug.enabled) {
            ctx.lineWidth = 5
            ctx.textAlign = "left"
            ctx.strokeStyle = "#000000"
            ctx.fillStyle = "#ffffff"
            ctx.font = Fonter.get("monospace", 20)
            ctx.strokeText(`fps: ${(1000 / dt).toPrecision(2)}`, 30, 1050)
            ctx.fillText(`fps: ${(1000 / dt).toPrecision(2)}`, 30, 1050)
            ctx.strokeText(`mem: ${(performance.memory.usedJSHeapSize / 1e6).toPrecision(3)}mb / ${(performance.memory.totalJSHeapSize / 1e6).toPrecision(3)}mb (${performance.memory.jsHeapSizeLimit} bytes max) (avg: ${((OverlayDrawer.debugMemoryUsages.reduce((a, b) => a + b, 0) / OverlayDrawer.debugMemoryUsages.length) || 0).toPrecision(3)}mb)`, 30, 1025)
            ctx.fillText(`mem: ${(performance.memory.usedJSHeapSize / 1e6).toPrecision(3)}mb / ${(performance.memory.totalJSHeapSize / 1e6).toPrecision(3)}mb (${performance.memory.jsHeapSizeLimit} bytes max) (avg: ${((OverlayDrawer.debugMemoryUsages.reduce((a, b) => a + b, 0) / OverlayDrawer.debugMemoryUsages.length) || 0).toPrecision(3)}mb)`, 30, 1025)
            ctx.textAlign = "center"
            OverlayDrawer.debugMemoryUsages.push(performance.memory.usedJSHeapSize / 1e6)

            // debug: draw all buttons etc
            ctx.lineWidth = 2

            ctx.textAlign = "left"
            ctx.font = Fonter.get("monospace", 15)

            ctx.fillStyle = "yellow"
            for (let button of EventHandler.buttons) {
                ctx.strokeStyle = button.hidden ? "red" : "blue"
                ctx.strokeRect(button.x, button.y, button.width, button.height)
                ctx.strokeText(`button ${button.id}`, button.x + 10, button.y + 20)
                ctx.fillText(`button ${button.id}`, button.x + 10, button.y + 20)
            }

            ctx.strokeStyle = "purple"
            for (let mouseMoveHandler of EventHandler.mouseMoveHandlers) {
                ctx.strokeRect(mouseMoveHandler.x, mouseMoveHandler.y, mouseMoveHandler.width, mouseMoveHandler.height)
                ctx.strokeText(`mouseMoveHandler ${mouseMoveHandler.id}`, mouseMoveHandler.x + 10, mouseMoveHandler.y + 40)
                ctx.fillText(`mouseMoveHandler ${mouseMoveHandler.id}`, mouseMoveHandler.x + 10, mouseMoveHandler.y + 40)
            }

            ctx.strokeStyle = "orange"
            for (let scrollHandler of EventHandler.scrollHandlers) {
                ctx.strokeRect(scrollHandler.x, scrollHandler.y, scrollHandler.width, scrollHandler.height)
                ctx.strokeText(`scrollHandler ${scrollHandler.id}`, scrollHandler.x + 10, scrollHandler.y + 60)
                ctx.fillText(`scrollHandler ${scrollHandler.id}`, scrollHandler.x + 10, scrollHandler.y + 60)
            }

            ctx.textAlign = "center"
        }

        if (Settings.settings.beta && GameHandler.state != GameState.Title && GameHandler.state != GameState.Loading) {
            if (!OverlayDrawer.betaBuildCanvas) {
                // skip drawing and use this frame to create the canvas
                ctx.font = Fonter.get(FontFamily.Righteous, 20)
                let width = ctx.measureText(OverlayDrawer.betaBuildString).width
                OverlayDrawer.betaBuildCanvas = new OffscreenCanvas(width, 30)
                let _ctx = OverlayDrawer.betaBuildCanvas.getContext("2d")
                _ctx.font = Fonter.get(FontFamily.Righteous, 20)
                _ctx.fillStyle = "white"
                _ctx.strokeStyle = "black"
                _ctx.textAlign = "center"
                _ctx.textBaseline = "middle"
                _ctx.lineWidth = 4
                _ctx.strokeText(OverlayDrawer.betaBuildString, width/2, 15)
                _ctx.fillText(OverlayDrawer.betaBuildString, width/2, 15)
            }
            
            ctx.globalAlpha = 0.2
            ctx.drawImage(OverlayDrawer.betaBuildCanvas, 1680, 10)
            ctx.globalAlpha = 1
        }

        if (Settings.settings.debug.enabled) {
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.fillStyle = "#ffffff"
            ctx.strokeStyle = "#000000"
            ctx.font = Fonter.get("monospace", 15)
            let recentLogs = this.logs.slice(1).slice(-50)
            let y = 100
            for (let log of recentLogs) {
                ctx.strokeText(log, 10, y)
                ctx.fillText(log, 10, y)
                y += 17
            }
            ctx.textAlign = "center"
        }
    }
}

setInterval(() => OverlayDrawer.debugMemoryUsages = [], 1000)
