class Settings {
    static settings = {
        isInNoAnimationMode: false,
        isInLowPerformanceMode: new URL(window.location.href).searchParams.get("low") == "true",
        debug: {
            enabled: new URL(window.location.href).searchParams.get("debug.enabled") == "true",
            zoom: Number(new URL(window.location.href).searchParams.get("debug.zoom"))
        },
        beta: true
    }
}
