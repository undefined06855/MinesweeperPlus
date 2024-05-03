class Utils {
    /**
     * @param {string} tileName 
     * @returns {string}
     */
    static getResourcesPath(tileName) {
        return `./assets/tiles/${tileName}/`
    }

    /**
     * @param {string} tileName 
     * @param {Array<string>} assets 
     * @returns {Promise<Array<HTMLImageElement>>}
     */
    static async genericLoadImageAssets(tileName, assets) {
        return new Promise(resolve => {
            let assetsLoaded = 0
            let imageObjects = []

            function checkAssets() {
                assetsLoaded++
                if (assetsLoaded == assets.length)
                    resolve(imageObjects)
            }

            assets.forEach((assetName, assetIndex) => {
                let path = Utils.getResourcesPath(tileName) + assetName
                let image = new Image()
                image.addEventListener("load", () => {
                    checkAssets()
                    imageObjects[assetIndex] = image
                })
                image.src = path
            })
        })
    }
}
