import { FC, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface IProps {
  title: string
  color: string
  changeColor: (color: string) => void
}
const ColorCard: FC<IProps> = ({ title, color, changeColor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempColor, setTempColor] = useState('')
  const changeHandle = (e: string): void => {
    setTempColor(e)
  }
  const clickHandle = (): void => {
    setIsOpen(true)
  }
  return (
    <div className=" flex mt-2 items-center ">
      <div>{title}</div>
      <div
        className=" w-5 h-5 cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={clickHandle}
      ></div>
      {isOpen && (
        <div className=" absolute left-0 top-[40px] w-full h-[calc(100%-40px)]">
          <div className=" absolute top-[77px] left-4 z-10">
            <HexColorPicker className=" w-50" color={color} onChange={changeHandle} />
            <div className="flex">
              <button
                className="my-1 mx-2"
                onClick={() => {
                  changeColor(tempColor)
                  setIsOpen(false)
                }}
              >
                确定
              </button>
              <button className="my-1 mx-2" onClick={() => setIsOpen(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorCard
