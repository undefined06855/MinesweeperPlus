class ClassCreator {
    static preClass() {
        tileManager = new TileManager()
        loadingScreen = new LoadingScreen()
    }

    static postClass() {
        title = new Title()
        setupScreen = new SetupScreen()
    }
}
