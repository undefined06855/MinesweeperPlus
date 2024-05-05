class Anim {
    /**
     * @param {AnimType} type
     * @param {number} scale
     * @param {number} length
     * @param {Array<Anim>} parentList
     */
    constructor(type, scale, length, parentList) {
        this.type = type
        this.scale = scale
        this.length = length
        this.parentList = parentList

        this.timer = 0
        this.paused = false

        this.animData = {}
    }

    tick(dt) {
        if (!this.paused)
            this.timer += dt

        if (this.timer >= this.length) {
            this.parentList.splice(this.parentList.indexOf(this))
        }
    }

    preDraw() {
        let percentage = this.timer / this.length
        if (this.type == AnimType.Shake) {
            let x = ((Math.random() * 2) - 1) * this.scale * (1 - percentage)
            let y = ((Math.random() * 2) - 1) * this.scale * (1 - percentage)
            ctx.translate(x, y)
            this.animData.x = x
            this.animData.y = y
            return
        }
    }

    postDraw() {
        let percentage = this.timer / this.length
        if (this.type == AnimType.Shake) {
            ctx.translate(-this.animData.x, -this.animData.y)
            return
        }
    }
}

/** @enum */
const AnimType = {
    Shake: 0
}
