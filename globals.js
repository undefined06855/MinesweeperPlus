let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

// See ClassCreator for where classes are defined

// earlyLoad stuff:
/** @type TileManager | undefined */
let tileManager
/** @type LoadingScreen | undefined */
let loadingScreen

// loaded after everything is loaded
/** @type Title | undefined */
let title
/** @type SetupScreen | undefined */
let setupScreen
/** @type SettingsScreen | undefined */
let settingsScreen

// this is created in SetupScreen
/** @type Sweeper | undefined */
let sweeper

/** @type number | undefined */
let dt
/** @type number | undefined */
let lastTime
