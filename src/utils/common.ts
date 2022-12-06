import { IChangeNavStyle, INavItem, IScrollTo } from '@/types/IUtils'
import dayjs from 'dayjs'

/**
 * 切换标签页样式
 * @param curNav 当前选中的标签
 * @param navlist 标签列表
 */
export const changeNavStyle: IChangeNavStyle<INavItem> = (curNav, navlist): void => {
  navlist.forEach(navItem => {
    navItem.isActive = curNav === navItem.navName
  })
}

/**
 * 随机生成20位序列值：当前时间 + 六位随机数
 * @returns 
 */
export const genRandomVal = (): string => {

  const curDate = dayjs().format('YYYYMMDDHHmmss')
  let randomSixStr = ''
  for (let i = 0; i < 6; i++) {
    randomSixStr += String(Math.floor(Math.random() * 10))
  }

  return curDate + randomSixStr
}

/**
 * 页面滚动
 * @param {*} top 高度
 * @param {*} left 宽度
 * @param {*} behavior 行为 smooth(平滑)
 */
export const scrollTo: IScrollTo = (top, left, behavior): void => {
  document.documentElement.scrollTo({
    top,
    left,
    behavior
  })
}
