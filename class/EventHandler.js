class EventHandler {
    static {
        canvas.addEventListener("click", event => {
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height
            
            sweeper.onClick(x, y)
        })

        canvas.addEventListener("contextmenu", event => {
            event.preventDefault()
            let rect = canvas.getBoundingClientRect()
            let x = (event.clientX - rect.left) * canvas.width / rect.width
            let y = (event.clientY - rect.top) *  canvas.height / rect.height
            
            sweeper.onFlag(x, y)
        })
    }
}
