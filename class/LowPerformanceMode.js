class LowPerformanceMode {
    static isInLowPerformanceMode = false
    static isInNoAnimationMode = false

    static {
        let origSin = Math.sin
        let origCos = Math.cos

        // override math functions to return 0 
        Math.sin = (...args) => {
            if (LowPerformanceMode.isInNoAnimationMode) return 0
            return origSin(...args)
        }

        Math.cos = (...args) => {
            if (LowPerformanceMode.isInNoAnimationMode) return 0
            return origCos(...args)
        }
    }

    /**
     * @param {function} callback 
     */
    static ifHighPerformance(callback) {
        if (!LowPerformanceMode.isInLowPerformanceMode) callback()
    }

    /**
     * @param {function} callback 
     */
    static ifNotHighPerformance(callback) {
        if (LowPerformanceMode.isInLowPerformanceMode) callback()
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
