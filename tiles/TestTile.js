class TestTile extends GenericTile {
    static name = "testicle tile!!!! woah it's so testful look how wide this name is haha testicle anyway According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body o".slice(0, 10)
    static description = [
        "how are you seeing this?? this",
        "is only meant to be for testing",
        "stuff like this description! like how long lines can get look at me this is such a long line",
        "and multiple lines",
        "wowow",
        "",
        "",
        "<< by the way these are all of the GlobalAssets",
        "",
        "",
        "",
        "look a space",
        "",
        "that's crazy"
    ]
    static generationChance = 98063450983456

    /**
     * @param {Cell} cell 
     */
    static init(cell) {
        cell.data.image = Object.values(GlobalAssets)[~~(Math.random() * Object.keys(GlobalAssets).length)]
    }

    /**
     * @param {Cell} cell 
     */
    static draw(cell) {
        ctx.drawImage(
            cell.data.image,
            0,
            0,
            cell.data.image.width,
            cell.data.image.height
        )
    }
        
    /**
     * @param {number} index 
     * @param {number} width 
     * @param {number} height 
     */
    static drawPreview(index, width, height) {
        // til you can do Object.keys on a class
        let imageIndex = ~~(index % Object.keys(GlobalAssets).length)
        /** @type HTMLImageElement */
        let image = Object.values(GlobalAssets)[imageIndex]
        ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height
        )
    }
}
