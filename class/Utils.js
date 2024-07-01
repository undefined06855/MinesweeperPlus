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
     * @param {number} ms 
     * @returns {Promise<undefined>}
     */
    static async wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    /**
     * @param {number} y 
     * @param {string} [col="#ff0000"] 
     */
    static drawLineHoriz(y, col = "#ff0000") {
        let origStrokeSize = ctx.lineWidth
        let origStrokeCol = ctx.strokeStyle

        ctx.lineWidth = 1
        ctx.strokeStyle = col

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(1920, y)
        ctx.stroke()

        ctx.strokeStyle = origStrokeCol
        ctx.lineWidth = origStrokeSize
    }

    /**
     * @param {number} x 
     * @param {string} [col="#ff0000"] 
     */
    static drawLineVert(x, col = "#ff0000") {
        let origStrokeSize = ctx.lineWidth
        let origStrokeCol = ctx.strokeStyle

        ctx.lineWidth = 1
        ctx.strokeStyle = col

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 1080)
        ctx.stroke()

        ctx.strokeStyle = origStrokeCol
        ctx.lineWidth = origStrokeSize
    }

    /**
     * @param {string | number} char 
     */
    static getCounterSlice(char) {
        char = char.toString()
        // 1234567890-
        let charWidth = 12
        let charHeight = 23

        let index = "1234567890-".indexOf(char)
        if (index == -1) return {}

        return {
            x: charWidth * index,
            y: 0,
            width: charWidth,
            height: charHeight
        }
    }

    /**
     * @param {number} time 
     * @returns {string}
     */
    static getTimeString(time) {
        let ms = ~~(time % 1000)
        let sec = ~~((time / 1000) % 60)
        let min = ~~((time / 60000) % 60)
        let hr = ~~((time / 3600000))

        let strms = ms.toString()
        let strsec = sec.toString().padStart(2, "0")
        let strmin = min.toString().padStart(2, "0")
        let strhr = hr.toString()

        if (hr > 0) {
            return `${strhr}:${strmin}:${strsec}`
        }

        if (min > 0) {
            return `${strmin}:${strsec}`
        }

        if (sec > 0) {
            return `${strsec}.${strms.padStart(3, "0")}`
        }

        return `${strms}ms`
    }
}

class Easing {
    static easeInOut(x) {
        return (Math.cos(Math.PI*(1-Math.max(Math.min(x, 1), 0))) + 1) / 2
    }

    static double(x) {
        return -4 * (x - 0.5) ** 2 + 1
    }
}
