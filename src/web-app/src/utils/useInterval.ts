import { useEffect, useRef } from "react"

export const useInterval = (callback, delay) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        const tick = () => {
            // @ts-ignore
            savedCallback && savedCallback.current && savedCallback.current()
        }

        if (delay !== null) {
            const id = setInterval(tick, delay)

            return () => {
                clearInterval(id)
            }
        }
    }, [callback, delay])
}