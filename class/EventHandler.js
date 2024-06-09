class EventHandlerEvent {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} id 
     * @param {Function} callback 
     */
    constructor(x, y, width, height, id, callback) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.id = id
        this.callback = callback
    }
}

class EventHandlerButtonEvent extends EventHandlerEvent {
    constructor(x, y, width, height, id, callback, hidden, button) {
        super(x, y, width, height, id, callback)
        this.hidden = hidden
        this.button = button
    }
}

class EventHandlerMouseEvent extends EventHandlerEvent {
    constructor(x, y, width, height, id, callback) {
        super(x, y, width, height, id, callback)
    }
}

class EventHandlerScrollEvent extends EventHandlerEvent {
    constructor(x, y, width, height, id, callback) {
        super(x, y, width, height, id, callback)
    }
}

class EventHandler {
    /** @type Array<EventHandlerButtonEvent> */
    static buttons = []

    /** @type Array<EventHandlerMouseEvent> */
    static mouseMoveHandlers = []

    /** @type Array<EventHandlerScrollEvent> */
    static scrollHandlers = []

    /** @private */
    static lastButtonID = 0

    static {
        /** @param {MouseEvent} event */
        function sharedClickHandler(event) {
            event.preventDefault()
            if (event.shiftKey) return

            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height

            for (let button of EventHandler.buttons.slice().reverse()) {
                if (button.x < x && button.x + button.width > x && button.y < y && button.y + button.height > y && button.button == event.button) {
                    button.callback(x, y)
                    break
                }
            }
        }

        document.body.addEventListener("click", sharedClickHandler)
        document.body.addEventListener("contextmenu", sharedClickHandler)
    
        // change cursor over buttons
        document.body.addEventListener("mousemove", event => {
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

        document.body.addEventListener("mousemove", event => {
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height
            
            for (let handler of EventHandler.mouseMoveHandlers) {
                if (handler.x < x && handler.x + handler.width > x && handler.y < y && handler.y + handler.height > y) {
                    handler.callback(x, y, event)
                }
            }
        })

        document.body.addEventListener("wheel", event => {
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height
            
            for (let handler of EventHandler.scrollHandlers) {
                if (handler.x < x && handler.x + handler.width > x && handler.y < y && handler.y + handler.height > y) {
                    handler.callback(x, y, event)
                }
            }
        })
    }

    /**
     * @param {number} id 
     */
    static clickButton(id) {
        EventHandler.buttons[id - 1].callback()
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
        let buttonObject = new EventHandlerButtonEvent(x, y, width, height, ++EventHandler.lastButtonID, callback, hidden, button)
        EventHandler.buttons.push(buttonObject)
        return EventHandler.lastButtonID
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

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Function} callback 
     * @returns {number}
     */
    static registerMouseMove(x, y, width, height, callback) {
        EventHandler.mouseMoveHandlers.push(new EventHandlerMouseEvent(x, y, width, height, ++EventHandler.lastButtonID, callback))
        return EventHandler.lastButtonID
    }

    /**
     * @param {number} id 
     * @returns {boolean} 
     */
    static unregisterMouseMove(id) {
        let index = EventHandler.mouseMoveHandlers.findIndex(obj => obj.id == id)
        if (index == -1) return false
        
        EventHandler.mouseMoveHandlers.splice(index, 1)
        return true
    }

    static unregisterAllMouseMoves() {
        EventHandler.mouseMoveHandlers = []
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Function} callback 
     * @returns {number}
     */
    static registerScroll(x, y, width, height, callback) {
        EventHandler.scrollHandlers.push(new EventHandlerScrollEvent(x, y, width, height, ++EventHandler.lastButtonID, callback))
        return EventHandler.lastButtonID
    }

    /**
     * @param {number} id 
     * @returns {boolean} 
     */
    static unregisterScroll(id) {
        let index = EventHandler.scrollHandlers.findIndex(obj => obj.id == id)
        if (index == -1) return false
        
        EventHandler.scrollHandlers.splice(index, 1)
        return true
    }

    static unregisterAllScrolls() {
        EventHandler.scrollHandlers = []
    }
}
