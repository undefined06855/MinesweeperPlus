class Utils {
    /**
     * @param {string} tileName 
     * @returns {string}
     */
    static getTileResourcePath(tileName) {
        return `./assets/tiles/${tileName}/`
    }

    /**
     * @param {string} basePath 
     * @param {Array<string>} assets 
     * @returns {Promise<Array<HTMLImageElement>>}
     */
    static async loadImageAssets(basePath, assets) {
        return new Promise(resolve => {
            let assetsLoaded = 0
            let imageObjects = []

            function checkAssets() {
                assetsLoaded++
                if (assetsLoaded == assets.length)
                    resolve(imageObjects)
            }

            assets.forEach((assetName, assetIndex) => {
                let path = basePath + assetName
                let image = new Image()
                image.addEventListener("load", () => {
                    checkAssets()
                    imageObjects[assetIndex] = image
                })
                image.src = path
            })
        })
    }

    /**
     * @param {string} tileName 
     * @param {Array<string>} assets 
     * @returns {Promise<Array<HTMLImageElement>>}
     */
    static async tileLoadImageAssets(tileName, assets) {
        return Utils.loadImageAssets(Utils.getTileResourcePath(tileName), assets)
    }

    /**
     * @param {Number} row 
     * @param {Number} col 
     * @param {function(Cell)} callback 
     */
    static loopOverSurroundingCells(row, col, callback) {
        let surroundingCellLocations = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ]

        surroundingCellLocations.forEach(location => {
            let newCell = Utils.getCellSafe(row + location[0], col + location[1])
            if (newCell == false) return
            callback(newCell)
        })
    }

    /**
     * @param {number} row 
     * @param {number} col 
     */
    static countSurroundingBombs(row, col) {
        let mines = 0

        Utils.loopOverSurroundingCells(row, col, cell => {
            if (tileManager.getTile(cell.id).isMine) {
                mines++
            }
        })

        return mines
    }

    /**
     * @param {number} row 
     * @param {number} col 
     * @returns {Cell | false}
     */
    static getCellSafe(row, col) {
        let cellRow = sweeper.grid[row]
        if (cellRow == undefined) return false
        let cell = cellRow[col]
        if (cell == undefined) return false
        return cell
    }

    /**
     * @param {HTMLImageElement} image 
     * @param {number} width 
     * @param {number} height 
     */
    static create9Slice(image, width, height) {

    }
}
