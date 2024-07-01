class LowPerformanceMode {
    static {
        let origSin = Math.sin
        let origCos = Math.cos

        // override math functions to return 0 
        Math.sin = (...args) => {
            if (Settings.settings.isInNoAnimationMode) return 0
            return origSin(...args)
        }

        Math.cos = (...args) => {
            if (Settings.settings.isInNoAnimationMode) return 0
            return origCos(...args)
        }
    }

    /**
     * @param {function} callback 
     */
    static ifHighPerformance(callback) {
        if (!Settings.settings.isInLowPerformanceMode) callback()
    }

    /**
     * @param {function} callback 
     */
    static ifNotHighPerformance(callback) {
        if (Settings.settings.isInLowPerformanceMode) callback()
    }
}

/**
 * @param {function} callback 
 */
function __HIPERFORMANCE(callback) {
    LowPerformanceMode.ifHighPerformance(callback)
}

/**
 * @param {function} callback 
 */
function __LOPERFORMANCE(callback) {
    LowPerformanceMode.ifNotHighPerformance(callback)
}
