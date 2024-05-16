import { ReactNode, createContext, useContext, useState } from 'react'

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
  const [bgColor, setBgColor] = useState('#fff')
  const [fontColor, setFontColor] = useState('#000')

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
