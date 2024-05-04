class Cell {
    /**
     * @param {Number} id 
     * @param {Number} row 
     * @param {Number} col 
     */
    constructor(id, row, col) {
        this.id = id
        this.row = row
        this.col = col
        this.data = {}
        this.uncovered = false
        this.flagged = false
    }
}
