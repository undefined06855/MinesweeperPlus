class InitialisableClass {
    initialised = false
    tryInit() {
        if (!this.initialised) try { this.init() } catch(_) {}
        this.initialised = true
    }
}
