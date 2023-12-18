import ajaxUtil from '@/libs/ajaxUtil'
import { getDate } from '@/utils/others'
import { localStore } from '@/utils/sessionStore'
const getExecStrs = (str) => {
  var reg = /\$\{(.+?)\}/g
  var list = []
  var result = null
  do {
    result = reg.exec(str)
    result && list.push(result[1])
  } while (result)

  return list
}
const replaceValue = (user, str) => {
  const currentDate = getDate('y-m-d h:i:s', new Date())
  const list = getExecStrs(str)

  for (const item of list) {
    if (item === 'currentTime') {
      str = str.replace('${' + item + '}', currentDate + ' ')
    } else {
      str = str.replace('${' + item + '}', user[item] + ' ')
    }
  }
  return str
}
const createsingleMark = (width, height, angle, opacity) => {
  const singleMark = document.createElement('div')
  singleMark.style = ' pointer-events: none; z-index: -1; float: left; overflow: visible; position: relative; margin-right: 0px;'
  singleMark.style.width = width + 'px'
  singleMark.style.height = height + 'px'
  singleMark.style.transform = `rotate(${-angle}deg)`
  singleMark.style.opacity = opacity / 100

  return singleMark
}
const createWatermark = (id, width, height, angle, opacity, text, color) => {
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
  const div = document.createElement('div')
  div.id = id
  div.style.cssText = 'display: block; pointer-events: none; position: fixed; width: 100%; height: 100%; z-index: 99999; top: 0px; left: 0px; text-align: center'
  for (let i = 0; i < 100; i++) {
    const watermark = createsingleMark(width, height, angle, opacity)
    watermark.innerHTML = text
    div.appendChild(watermark)
  }
  document.body.appendChild(div)
}
const init = (width, height, angle, opacity, text, color) => {
  const id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
  createWatermark(id, width, height, angle, opacity, text, color)
  return id
}

export const findWaterMark = (payload) => {
  return ajaxUtil.ajax({
    url: `/api/afc/water_marks`,
    method: 'get',
    data: payload
  })
}
export const getWaterMarkWhiteEmps = (payload) => {
  return ajaxUtil.ajax({
    url: `/api/afc/employees/water-mark/employees`,
    method: 'get',
    data: payload
  })
}

// 添加水印方法
export const setWaterMark = (width, height, angle, opacity, text, color) => {
  let id = init(width, height, angle, opacity, text, color)
  if (document.getElementById(id) === null) {
    id = init(width, height, angle, opacity, text, color)
  }
}

// 移除水印方法
export const removeWatermark = () => {
  const id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
}

export const dealWaterMark = () => {
  const watermark = localStore.get('watermark')
  const user = localStore.get('user')
  const emplists = localStore.get('watermarkmwhiteListEmps')
  // 如果设置水印
  if (watermark) {
    // 开启水印
    if (watermark.isEnable == 'true') {
      // 判断用户是否在水印白名单，在水印白名单不显示
      if (emplists.length > 0) {
        if (!emplists.includes(user.attributes.employeeId)) {
          // 不在水印白名单 设置水印
          const content = replaceValue(user, watermark.content)
          setWaterMark(watermark.waterMarkWidth, watermark.waterMarkHeight, watermark.rotationAngle, watermark.opaticy, content, 'rgb(209 209 209)')
        } else {
          removeWatermark()
        }
      } else {
        // 白名单没数据，全部设置水印
        const content = replaceValue(user, watermark.content)
        setWaterMark(watermark.waterMarkWidth, watermark.waterMarkHeight, watermark.rotationAngle, watermark.opaticy, content, 'rgb(209 209 209)')
      }
    } else {
      removeWatermark()
    }
  }
}

