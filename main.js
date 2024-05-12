let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

// global classes BEFORE load
let tileManager = new TileManager()
LoadHandler.loadAll()

let title
let sweeper
let dt
let lastTime

GameHandler.init()
