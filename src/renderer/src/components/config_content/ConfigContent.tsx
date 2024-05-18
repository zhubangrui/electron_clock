import { FC, ReactNode } from 'react'
import ColorCard from './components/color_card/ColorCard'
import { useColor } from '@renderer/common/context/ColorProvider'
import Mp3 from '../../assets/bell.wav'
import { useSound } from '@renderer/hooks/useSound'
interface IProps {
  closeTool: () => void
}
const ConfigContent: FC<IProps> = ({ closeTool }): ReactNode => {
  const { fontColor, bgColor } = useColor()
  const { playSound, stopSound } = useSound(Mp3)
  const changeHandle = (e: string, type: string): void => {
    // changeBgColor(e)
    window.electron.ipcRenderer.send('change_color', { type, color: e })
  }

  return (
    <>
      <div className=" py-2 flex justify-between mr-auto border-b-while border-b-[1px]">
        <div className=" flex-1 text-lg">常用配置</div>
        <div className=" w-[25px] cursor-pointer text-right" onClick={closeTool}>
          X
        </div>
      </div>
      <ColorCard
        title="翻转背景颜色："
        color={bgColor}
        changeColor={(e) => changeHandle(e, 'bg_color')}
      />
      <ColorCard
        title="时钟数字颜色："
        color={fontColor}
        changeColor={(e) => changeHandle(e, 'font_color')}
      />
      <div className=" flex mt-3">
        背景音效测试：
        <button onClick={playSound} className="mr-5">
          播放
        </button>
        <button onClick={stopSound}>停止</button>
      </div>
    </>
  )
}

export default ConfigContent
