export const debounce = (cb: () => void, timeout = 200) => {
    let lasttime = 0;
    return () => {
        let now = Date.now()
        if (now - timeout > lasttime) {
            lasttime = now;
            cb();
        }
    }
}