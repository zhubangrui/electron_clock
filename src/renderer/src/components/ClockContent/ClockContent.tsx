import { ReactNode, useEffect, useState } from 'react'
import styles from './ClockContent.module.css'

const ClockContent = (): ReactNode => {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <div className={styles.container}>{currentTime}</div>
    </>
  )
}

export default ClockContent
