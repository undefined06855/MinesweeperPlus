let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

// global classes BEFORE load:
let tileManager = new TileManager()
let loadingScreen = new LoadingScreen()
LoadHandler.loadAll()

// global classes defined AFTER load:
/** @type Title | undefined*/
let title
/** @type SetupScreen | undefined */
let setupScreen
/** @type Sweeper | undefined */
let sweeper
/** @type number | undefined */
let dt
/** @type number | undefined */
let lastTime

GameHandler.init()
