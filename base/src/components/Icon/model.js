import { localStore } from '@/utils/sessionStore';
import md5 from 'md5';
export default {
  computed: {
    loadPrefix() {
      const globalConfig = localStore.get('globalConfig') // 读取全局配置
      return globalConfig.apiPrefix.path === '/' ? '' : globalConfig.apiPrefix.path
    },
  },
  methods: {
    dynamicLoadCss(url) {
      const id = md5(url).substring(0, 6)
      if(document.getElementById(id)) {
          return
      }
      var head = document.getElementsByTagName('head')[0]
      var link = document.createElement('link')
      link.id = id
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = url
      head.appendChild(link)
    },
    cssLoadUrl(groupCode) {
      return `${this.loadPrefix}/api/afc/materials/font/${groupCode}/iconfont.css`
    },
    svgUrl(code) {
      return `${this.loadPrefix}/api/afc/materials/font/actions/show?code=${code}&iconType=svg&types=icon`
    }
  }
}