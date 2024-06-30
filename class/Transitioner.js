/** @enum */
let Transition = {
    CirclePinhole: 0,
    Fade: 1
}

class Transitioner {
    static isTransitioning = false
    static transitionTimer = 0
    static newGameState = null
    static transitionType = null
    static transitionLength = null
    static circleSize = 2202.9071700822983 // Math.sqrt(1920**2 + 1080**2) (diagonal distance between center and corner of screen)

    /**
     * @param {number} newGameState 
     * @param {number} [transitionType=Transition.CirclePinhole] 
     * @returns {boolean}
     */
    static to(newGameState, transitionType = Transition.CirclePinhole, length = 700) {
        if (Transitioner.isTransitioning) return false

        console.log("Transition to %s", newGameState)
        Transitioner.newGameState = newGameState
        Transitioner.isTransitioning = true
        Transitioner.transitionTimer = 0
        Transitioner.transitionType = transitionType
        Transitioner.transitionLength = length

        switch(newGameState) {
            case GameState.Loading:
                loadingScreen.initialised = false
                break
            case GameState.Title:
                title.initialised = false
                break
            case GameState.GameSetup:
                setupScreen.initialised = false
                break
            case GameState.Game:
                // sweeper.initialised = false
                break
            default:
                console.warn("Could not uninitialise game state %s!", newGameState)
                return false
        }

        return true
    }

    static tick() {
        if (!Transitioner.isTransitioning) return

        Transitioner.transitionTimer += dt
    }

    static draw() {
        if (!Transitioner.isTransitioning) return
        let p = Transitioner.transitionTimer / Transitioner.transitionLength

        if (p >= 0.5 && GameHandler.state != Transitioner.newGameState) {
            GameHandler.state = Transitioner.newGameState
        }

        if (p >= 1) {
            Transitioner.isTransitioning = false
            return
        }

        if (Transitioner.transitionType == Transition.CirclePinhole) {
            ctx.fillStyle = "#000"
            if (p < 0.5) {
                ctx.beginPath()
                ctx.arc(960, 540, p * Transitioner.circleSize, 0, Math.PI * 180)
                ctx.fill()
            } else {
                p -= 0.5
                ctx.beginPath()
                ctx.rect(0, 0, 1920, 1080)
                ctx.closePath()
                ctx.arc(960, 540, p * Transitioner.circleSize, 0, Math.PI * 180)
                ctx.closePath()
                ctx.fill("evenodd")
            }
        } else if (Transitioner.transitionType == Transition.Fade) {
            ctx.globalAlpha = -2 * Math.abs(p - 0.5) + 1
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, 1920, 1080)
            ctx.globalAlpha = 1
        } else {
            ctx.textAlign = "left"
            ctx.font = Fonter.get("monospace", 30)
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, 700, 100)
            ctx.fillStyle = "#ffffff"
            ctx.fillText("Unknown transition: " + Transitioner.transitionType, 40, 40)
            ctx.fillText("%: " + p, 40, 80)
            ctx.textAlign = "center"
        }
    }
}
