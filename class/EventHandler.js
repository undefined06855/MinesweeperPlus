class EventHandler {
    /** @type Array<EventHandlerButton> */
    static buttons = []

    /** @private */
    static lastButtonID = 0

    static {
        canvas.addEventListener("click", event => {
            event.preventDefault()
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height

            for (let button of this.buttons.slice().reverse()) {
                if (button.x < x && button.x + button.width > x && button.y < y && button.y + button.height > y && button.button == event.button) {
                    button.callback(x, y)
                    break
                }
            }
        })

        canvas.addEventListener("contextmenu", event => {
            event.preventDefault()
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height

            for (let button of this.buttons.slice().reverse()) {
                if (button.x < x && button.x + button.width > x && button.y < y && button.y + button.height > y && button.button == event.button) {
                    button.callback(x, y)
                    break
                }
            }
        })

        canvas.addEventListener("mousemove", event => {
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height
            
            let hovering = false
            for (let button of EventHandler.buttons.slice().reverse()) {
                if (button.x < x && button.x + button.width > x && button.y < y && button.y + button.height > y) {
                    // yup
                    if (!button.hidden) hovering = true
                    break
                }
            }

            canvas.style.cursor = hovering ? "pointer" : "default"
        })
    }

    static draw() {
        // debug: draw all buttons
        ctx.lineWidth = 10
        for (let button of EventHandler.buttons) {
            ctx.strokeStyle = button.hidden ? "red" : "blue"
            ctx.fillStyle = button.hidden ? "red" : "blue"
            ctx.strokeRect(button.x, button.y, button.width, button.height)
            ctx.font = Fonter.get("monospace", 15)
            ctx.textAlign = "left"
            ctx.fillText(`button ${button.id}`, button.x + 10, button.y + 20)
            ctx.textAlign = "center"
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Function} callback 
     * @param {boolean} [hidden=false] 
     * @param {number} [button=0] 
     * @returns {number}
     */
    static registerButton(x, y, width, height, callback, hidden = false, button = 0) {
        let buttonObject = new EventHandlerButton(x, y, width, height, ++EventHandler.lastButtonID, hidden, callback, button)
        EventHandler.buttons.push(buttonObject)
        return EventHandler.lastButtonID
    }

    /**
     * @param {number} id 
     * @returns {EventHandlerButton}
     */
    static getButton(id) {
        return EventHandler.buttons.findIndex(obj => obj.id == id)
    }

    /**
     * @param {number} id 
     * @returns {boolean} 
     */
    static unregisterButton(id) {
        let index = EventHandler.buttons.findIndex(obj => obj.id == id)
        if (index == -1) return false
        
        EventHandler.buttons.splice(index, 1)
        return true
    }

    static unregisterAllButtons() {
        EventHandler.buttons = []
    }
}
