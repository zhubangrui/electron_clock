import { FC, ReactNode } from 'react'
import ColorCard from './components/color_card/ColorCard'
import { useColor } from '@renderer/common/context/ColorProvider'
interface IProps {
  closeTool: () => void
}
const ConfigContent: FC<IProps> = ({ closeTool }): ReactNode => {
  const { fontColor, bgColor, changeBgColor, changeFontColor } = useColor()

  return (
    <>
      <div className=" py-2 flex justify-between mr-auto border-b-while border-b-[1px]">
        <div className=" flex-1 text-lg">常用配置</div>
        <div className=" w-[25px] cursor-pointer text-right" onClick={closeTool}>
          X
        </div>
      </div>
      <ColorCard title="翻转背景颜色：" color={bgColor} changeColor={(e) => changeBgColor(e)} />
      <ColorCard title="时钟数字颜色：" color={fontColor} changeColor={(e) => changeFontColor(e)} />
    </>
  )
}

export default ConfigContent
