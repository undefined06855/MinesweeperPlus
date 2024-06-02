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
