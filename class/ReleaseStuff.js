// uhhhhh add this on release?? idk

const DEBUG = true

if (!DEBUG) {
    console.log = (_, ..._) => {}
    console.debug = (_, ..._) => {}
    console.error = (_, ..._) => {}
    console.warn = (_, ..._) => {}
    console.info = (_, ..._) => {}
}
