import { ReactNode, useEffect, useRef, useState } from 'react'
// import './base.css'
import './clock.scss'

const getSliceTime = (): number[] => {
  return new Date()
    .toLocaleTimeString()
    .replaceAll(':', '')
    .split('')
    .map((n) => +n)
}

const Clock = (): ReactNode => {
  const [timeSplice, setTimeSplice] = useState<number[]>([])

  const contentRef = useRef<HTMLDivElement>(null)

  //获取前一个数字和后一个数字
  const getNextNumber = (index: number): [number, number] => {
    const befor = timeSplice[index]
    let after = befor + 1
    if (index % 2) {
      //判断个位数，大于9时变为0
      after = after > 9 ? 0 : after
    } else {
      //判断十位数，大于等于6时，变为0
      after = after >= 6 ? 0 : after
    }
    return [befor, after]
  }

  //动态创建存入时间的卡片
  const createCard = (timeArr: number[]): void => {
    timeArr.forEach((t, i) => {
      const newElement = document.createElement('div')
      newElement.classList.add('clock_card')
      newElement.innerHTML = `<section  class='box'>
      <div data-before=${t} data-after=${t + 1}></div>
        <div data-before=${t} data-after=${t + 1}></div>
      </section>`
      contentRef.current?.insertAdjacentElement('beforeend', newElement)

      //判断为偶数时插入p标签，为了实现 '：' 时，分后面的冒号
      if (i % 2 && i !== timeArr.length - 1) {
        newElement.innerHTML += `<p></p>`
        contentRef.current?.insertAdjacentElement('beforeend', newElement)
      }
    })
  }
  useEffect(() => {
    //当分片时间的值每秒改变时，动态显示时间

    if (contentRef.current) {
      //获取存入时分秒的6组元素，每组中有二个div用于显示上一个数值和下一个数组，
      const el = Array.from(contentRef.current?.querySelectorAll('.clock_card')).map((sestion) =>
        sestion.querySelectorAll('div')
      )
      if (el.length) {
        //遍历每组元素，每组元素中有两个DIV
        el.forEach((divs, index) => {
          const [befor, after] = getNextNumber(index)

          //只需第二个div要转运，所以要获取第二个div
          const div = divs[1]

          //当前一个时间不等于当前时间时添加动画
          if (div.dataset.before !== `${befor}`) {
            div.classList.add('flipDown')
          }

          //为befor和after添加数据
          // div.dataset.before = `${num}`
          // div.dataset.after = `${num + 1}`

          //监听动画
          div.addEventListener('animationend', () => {
            divs.forEach((div) => {
              div.dataset.before = `${befor}`
              div.dataset.after = `${after}`
            })
            div.classList.remove('flipDown')
          })
        })
      }
    }
  }, [timeSplice])

  useEffect(() => {
    //传入当前时间分片后的值
    createCard(getSliceTime())

    //每秒更新分片的值
    const timer = setInterval(() => {
      setTimeSplice(getSliceTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (prevCount === 8) {
  //       clearInterval(timer)
  //     } else {
  //       setPrevCount(count) // 存储前一个计数值
  //       setCount((prevCount) => prevCount + 1) // 更新当前计数值
  //       divRef.current!.classList.add('flipDown')
  //     }
  //   }, 1000)

  //   // const f = (): void => {
  //   //   divRef.current!.classList.remove('flipDown')
  //   // }
  //   // divRef.current!.addEventListener('animationend', f)
  //   return () => {
  //     clearInterval(timer)
  //     // divRef.current!.removeEventListener('animationend', f)
  //   }
  // }, [prevCount, count, divRef.current])

  return (
    <>
      <div ref={contentRef} style={{ display: 'flex' }}></div>
    </>
  )
}

export default Clock
