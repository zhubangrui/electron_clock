import { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './control.module.scss'
import Seting from '../../assets/icon/seting.png'
import ConfigContent from '../config_content/ConfigContent'
const ControlConfig = (): ReactNode => {
  const topRef = useRef<HTMLDivElement>(null)
  const contRef = useRef<HTMLDivElement>(null)
  const [isDrag, setIsDrag] = useState(false)
  const [open, setOpen] = useState(false)
  // const leaveHandle = (): void => {
  //   console.log('ll3333')
  //   setIsHovered(false)
  //   // topRef.current?.style.setProperty('-webkit-app-region', 'no-drag')
  //   // setDisState('none')
  // }

  const mouseHandle = async (isOpen: boolean): Promise<void> => {
    const res = await window.electron.ipcRenderer.invoke('mouse_move', isOpen)
    setIsDrag(res)
    console.log(res)
  }
  useEffect(() => {
    const topRefHandle = (): void => {
      mouseHandle(false)
    }
    const contRefHandle = (): void => {
      mouseHandle(true)
    }
    topRef.current?.addEventListener('mouseenter', topRefHandle)
    contRef.current?.addEventListener('mouseenter', contRefHandle)

    return () => {
      topRef.current?.removeEventListener('mouseenter', topRefHandle)
      contRef.current?.removeEventListener('mouseenter', contRefHandle)
    }
  }, [topRef.current, contRef.current])

  const openTool = (): void => {
    setOpen(true)
    // mouseHandle(false)
  }
  const closeTool = (): void => {
    setOpen(false)
    // mouseHandle(true)
  }
  const style: { [key: string]: string } = {
    WebkitAppRegion: !isDrag ? 'drag' : 'no-drag'
  }

  return (
    <div className={styles.container}>
      <div className={styles.top} ref={topRef} style={style}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.tools}>
            <img src={Seting} style={{ width: '15px' }} alt="" onClick={openTool} />
          </div>
        </div>
      </div>
      <div className=" h-[360px]" style={{ display: !open ? 'block' : 'none' }} ref={contRef}></div>
      <div className={styles.config_cont} style={{ display: open ? 'block' : 'none' }}>
        <ConfigContent closeTool={closeTool} />
      </div>
    </div>
  )
}

export default ControlConfig
