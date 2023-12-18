import Cookie from 'js-cookie'
const theme = {
  dark: {
    subMenuBackground: 'rgba(0,0,0,.3)',
    menuBg: '#304156',
    menuItemBg: '#304156',
    menuHover: '#263445',
    menuItemActiveBg: 'rgba(0,0,0,0.1)',
    menuItemActiveBr: 'rgba(0,0,0,.8)',
    menuItemActiveText: 'rgba(0,0,0,.8)',
    subMenuBg: '#1f2d3d',
    subMenuHover: 'rgba(0,0,0,0.1)',
    menuText: '#808383',
    menuActiveText: 'rgba(0,0,0,.8)',
    tagBg: 'rgba(0,0,0,.8)',
    tagBorderColor: 'rgba(0,0,0,.8)',
    topBarBg: '#28528e',
    topBarBg1: '#2a4767',
    mainTextColor: '#ffffff'
  },
  light: {
    subMenuBackground: 'rgba(0,0,0,.3)',
    menuBg: '#ffffff',
    menuItemBg: '#ffffff',
    menuHover: 'rgba(0,0,0,.1)',
    menuItemActiveBg: 'rgba(0,0,0,.1)',
    menuItemActiveBr: '#0066cc',
    menuItemActiveText: '#0066cc',
    subMenuBg: 'rgba(255,255,255,.95)',
    subMenuHover: 'rgba(0,0,0,.1)',
    menuText: '#000000',
    menuActiveText: '#000000',
    tagBg: '#ffffff',
    tagBorderColor: '#000',
    topBarBg: '#ffffff',
    topBarBg1: '#ffffff',
    mainTextColor: '#ffffff'
  },
  green: {
    subMenuBackground: 'rgba(0,153,51,.3)',
    menuBg: 'rgb(0,153,51)',
    menuItemBg: 'rgba(0,153,51,.95)',
    menuHover: 'rgba(0,153,51,.1)',
    menuItemActiveBg: 'rgba(0,153,51,.1)',
    menuItemActiveBr: 'rgb(0,153,51)',
    menuItemActiveText: 'rgb(0,153,51)',
    subMenuBg: 'rgba(0,153,51,.95)',
    subMenuHover: 'rgba(0,153,51,.1)',
    menuText: '#808383',
    menuActiveText: '#ffffff',
    tagBg: 'rgb(0,153,51)',
    tagBorderColor: 'rgb(0,153,51)',
    topBarBg: '#28528e',
    topBarBg1: '#2a4767',
    mainTextColor: '#ffffff'
  },
  blue: {
    subMenuBackground: 'rgba(0,0,0,.3)',
    menuBg: '#304156',
    menuItemBg: 'rgba(0, 168, 255, .2)',
    menuHover: 'rgba(0, 168, 255, .15)',
    menuItemActiveBg: '#deeaf6',
    menuItemActiveBr: '#1890ff',
    menuItemActiveText: '#1890ff',
    subMenuBg: '#1f2d3d',
    subMenuHover: '#deeaf6',
    menuText: '#808383',
    menuActiveText: '#ffffff',
    tagBg: '#1890ff',
    tagBorderColor: '#1890ff',
    topBarBg: '#28528e',
    topBarBg1: '#2a4767',
    mainTextColor: '#ffffff'
  },
  red: {
    subMenuBackground: 'rgba(255,51,51,.3)',
    menuBg: 'rgb(255,51,51)',
    menuItemBg: 'rgba(255,51,51,.95)',
    menuHover: 'rgba(255,51,51,.2)',
    menuItemActiveBg: 'rgba(255,51,51,.2)',
    menuItemActiveBr: 'rgb(255,51,51)',
    menuItemActiveText: 'rgb(255,51,51)',
    subMenuBg: 'rgba(255,51,51,.95)',
    subMenuHover: 'rgba(255,51,51,.2)',
    menuText: '#808383',
    menuActiveText: '#ffffff',
    tagBg: 'rgb(255,51,51)',
    tagBorderColor: 'rgb(255,51,51)',
    topBarBg: '#28528e',
    topBarBg1: '#2a4767',
    mainTextColor: '#ffffff'
  },
  orange: {
    subMenuBackground: 'rgba(255,153,0,.3)',
    menuBg: 'rgb(255,153,0)',
    menuItemBg: 'rgba(255,153,0,.95)',
    menuHover: 'rgba(255,153,0,.1)',
    menuItemActiveBg: 'rgba(255,153,0,.1)',
    menuItemActiveBr: 'rgb(255,153,0)',
    menuItemActiveText: 'rgb(255,153,0)',
    subMenuBg: 'rgba(255,153,0,.95)',
    subMenuHover: 'rgba(255,153,0,.1)',
    menuText: '#808383',
    menuActiveText: '#ffffff',
    tagBg: 'rgb(255,153,0)',
    tagBorderColor: 'rgb(255,153,0)',
    topBarBg: '#28528e',
    topBarBg1: '#2a4767',
    mainTextColor: '#ffffff'
  },
}
function changeTheme(id = 'blue') {
  Cookie.set('theme', id)
  Object.keys(theme[id]).forEach(key => {
    document.documentElement.style.setProperty(`--${key}`, theme[id][key])
  })
}

export {
  changeTheme
}

