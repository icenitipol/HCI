 let lasttime = Date.now()
 let GameLoop: () => void = undefined
 let dt = 0

export const setGameLoopFunction = (cb: () => void) => {GameLoop = cb}
export const getDT = () => dt

setInterval(() => {
    let now = Date.now()
    dt = now - lasttime
    lasttime = now
    if(GameLoop) GameLoop()
    // console.log(GameLoop)
}, 0)