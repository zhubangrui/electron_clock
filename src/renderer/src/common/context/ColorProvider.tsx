import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { initColor } from '../config'

interface IColor {
  bgColor: string
  fontColor: string
  changeBgColor: (color: string) => void
  changeFontColor: (color: string) => void
}

const ColorContext = createContext<IColor>({
  bgColor: '',
  fontColor: '',
  changeBgColor: () => {},
  changeFontColor: () => {}
})

const ColorProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [bC, fC] = initColor
  const [bgColor, setBgColor] = useState(bC)
  const [fontColor, setFontColor] = useState(fC)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.electron.ipcRenderer.on('get_color', (data: any) => {
      console.log(data)
      setBgColor(data.bgColor)
      setFontColor(data.fontColor)
    })

    window.electron.ipcRenderer.invoke('init_color', { bC, fC }).then((res) => {
      if (res) {
        setBgColor(`${res.bgColor}`)
        setFontColor(`${res.fontColor}`)
      }
    })

    return () => window.electron.ipcRenderer.removeAllListeners('get_color')
  }, [])
  const changeBgColor = (color: string): void => setBgColor(color)
  const changeFontColor = (color: string): void => setFontColor(color)

  const data = {
    bgColor,
    fontColor,
    changeBgColor,
    changeFontColor
  }

  return <ColorContext.Provider value={data}>{children}</ColorContext.Provider>
}

export default ColorProvider
export const useColor = (): IColor => useContext(ColorContext)
