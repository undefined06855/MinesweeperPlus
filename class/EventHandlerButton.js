class EventHandlerButton {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} id 
     * @param {boolean} hidden 
     * @param {Function} callback 
     * @param {number} button
     */
    constructor(x, y, width, height, id, hidden, callback, button) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.id = id
        this.hidden = hidden
        this.callback = callback
        this.button = button
    }
}
