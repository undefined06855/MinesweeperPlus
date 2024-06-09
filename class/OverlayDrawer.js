// this is basically all debug and beta shit
// can be removed in full release or whatever
class OverlayDrawer {
    /** @type OffscreenCanvas | undefined */
    static betaBuildCanvas = undefined
    static betaBuildString = "(really, really beta build)"
    static flags = {
        debug: false,
        beta: true
    }

    static draw() {
        if (OverlayDrawer.flags.debug) {
            ctx.lineWidth = 5
            ctx.textAlign = "left"
            ctx.strokeStyle = "#000000"
            ctx.fillStyle = "#ffffff"
            ctx.font = Fonter.get("monospace", 20)
            ctx.strokeText(`fps: ${(1000 / dt).toPrecision(2)}`, 30, 1050)
            ctx.fillText(`fps: ${(1000 / dt).toPrecision(2)}`, 30, 1050)
            ctx.textAlign = "center"

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

        if (OverlayDrawer.flags.beta && GameHandler.state != GameState.Title && GameHandler.state != GameState.Loading) {
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
    }    
}
