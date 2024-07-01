class Hooker {
    /**
     * @param {function} method 
     * @param {function} callback 
     */
    static hook(method, callback) {
        try { console.log(`Hooking ${method.name}(${method.arguments})`) } catch(_) { console.log(`Hooking ${method.name}(...args)`) }
        let orig = method
        method = function(...args) {
            let ret = callback(...args)
            console.log("called")
            if (typeof ret == "boolean") {
                if (!ret) return
            }
            orig.call(this, ...args)
        }        
    }

    static applyHooks() {
        if (Settings.settings.debug.enabled) Hooker.applyDebugHooks()

        // CanvasRenderingContext2D#scale
        !(() => {
            let orig = CanvasRenderingContext2D.prototype.scale
            CanvasRenderingContext2D.prototype.scale = function(...args) {
                if (args[0] == 0 || args[1] == 0) {
                    console.warn("Skipping CanvasRenderingContext2D#scale call with zero scale!")
                    return
                }

                orig.call(this, ...args)
            }
        })()

        // errors
        window.addEventListener("error", event => {
            console.warn("Error detected! Stopping game and warning user...")
            GameHandler.hasErrored = true
            EventHandler.unregisterAllButtons()
            EventHandler.unregisterAllMouseMoves()
            EventHandler.unregisterAllScrolls()
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            ctx.resetTransform()

            // ctx.fillStyle = "red"
            // ctx.fillRect(0, 0, 1920, 1080)
            ctx.fillStyle = "#000000"
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 5
            ctx.font = Fonter.get(FontFamily.Righteous, 40)
            ctx.strokeText("There was an unrecoverable error!", 10, 50)
            ctx.fillText("There was an unrecoverable error!", 10, 50)
    
            ctx.font = Fonter.get(FontFamily.Righteous, 20)
    
            let splitFilename = event.filename.split("/")
            let fileName = splitFilename.pop()
            let pathName = splitFilename.pop()
            ctx.strokeText(`${pathName}/${fileName} @ ${event.lineno}:${event.colno}`, 10, 80)
            ctx.fillText(`${pathName}/${fileName} @ ${event.lineno}:${event.colno}`, 10, 80)
    
            let y = 110
            let x = 10
            let split = event.message.split(": ")
            split = split.map((chunk, i) => chunk += i == split.length - 1 ? "" : ":")
            for (let chunk of split) {
                ctx.strokeText(chunk, x, y)
                ctx.fillText(chunk, x, y)
                y += 30
                x += 10
            }
    
            ctx.strokeText("(Please screenshot this and send to @undefined06855!)", 10, 1060)
            ctx.fillText("(Please screenshot this and send to @undefined06855!)", 10, 1060)
        })
    }

    static applyDebugHooks() {
        // window.console.*
        for (let type of ["log", "info", "debug", "warn", "error"]) {
            let orig = console[type]
            console[type] = function(...args) {
                OverlayDrawer.logs.push(`[${type.toUpperCase()}] ` + args.join(", "))
                orig.call(this, ...args)
            }
        }
    }
}
