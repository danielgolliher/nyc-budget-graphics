import { useState, useEffect, useRef } from 'react'

export default function useContainerSize() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timer
    const observer = new ResizeObserver((entries) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width)
        }
      }, 100)
    })

    observer.observe(el)
    setWidth(el.getBoundingClientRect().width)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return { ref, width }
}
