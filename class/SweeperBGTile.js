class SweeperBGTile {
    constructor() {
        this.width = (Math.random() * 120) + 200
        this.height = this.width + (Math.random() * 10)-5
        this.x = (1920 - this.width) * Math.random()
        this.y = (1080 - this.height) * Math.random()
        this.opacityHexString = (~~(Math.random() * 30)).toString(16).padStart(2, "0")
        this.rotation = Math.random() * 360
        this.direction = Math.sign(Math.random() - 0.5)
        this.id = Math.random()

        this.lifetime = this.width * this.height / 5
        this.speed = this.width / 2700
        this.animTick = 0
    }

    tick() {
        this.animTick += dt
        this.rotation += this.direction * this.speed
    }
}
