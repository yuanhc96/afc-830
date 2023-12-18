import axios from 'axios'
const devMode = process.env.NODE_ENV === 'development'

export async function loadRemoteComponent(config) {
  if (!devMode && window.loadRemoteUrls && window.loadRemoteUrls.findIndex(s => s === config.url) > -1) { // 生产模式下防止重复加载文件
    return loadComponentByWebpack(config)
  } else {
    return loadScript(config).then(async() => await loadComponentByWebpack(config), () => import('@/views/BlankComponent.vue'))
  }
}

function loadScript(config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')

    if (config.url.startsWith('http')) {
      script.src = config.url
    } else {
      script.src = !config.url.startsWith('.') ? `.${config.url}` : config.url
    }

    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      // console.log(`Dynamic Script Loaded: ${config.url}`)
      document.head.removeChild(script)
      resolve()
      if (!window.loadRemoteUrls) {
        window.loadRemoteUrls = []
      }
      window.loadRemoteUrls.push(config.url)
    }
    script.onerror = () => {
      console.error(`Dynamic Script Error: ${config.url}`)
      document.head.removeChild(script)
      reject()
    }
    document.head.appendChild(script)
  })
}

async function loadComponentByWebpack({ scope, module }) {
  await __webpack_init_sharing__('default')
  const container = window[scope]
  if (container && container.init) {
    await container.init(__webpack_share_scopes__.default)
    if (Array.isArray(module)) {
      return await module.map(async m => {
        const factory = await container.get(m)
        try {
          return await factory()
        } catch (e) {
          console.error(e)
          console.warn(`${scope} 里没有找到 ${m} 模块`)
          return null
        }
      })
    } else {
      try {
        const factory = await container.get(module)
        return await factory()
      } catch (e) {
        console.error(e)
        console.warn(`${scope} 里没有找到 ${module} 模块`)
        return null
      }
    }
  } else {
    console.error(`加载${scope}出错`)
    return null
  }
}

export async function getModules(config) {
  try {
    let { url } = config
    if (url.startsWith('/')) {
      url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? `:${window.location.port}` : '') + url
    }
    let pre = `/afc/`
    if (Vue.config.isExpress) {
      const path = Vue.config.apiPrefix.path
      pre = path.endsWith('/') ? path : `${path}/`
    }
    url = `${pre}actuator/resource-loader?resourceUri=${url}`
    let data = (await axios.get(url)).data
    data = data.split('var moduleMap = ').length > 1 ? data.split('var moduleMap = ')[1] : data.split('var moduleMap = ')[0]
    data = data.split('var get = ')[0]
    data = data.match(new RegExp('"./(.*?)":', 'gi'))
    data = data.map(item => item.replace('":', '').replace('"./', ''))
    return data.filter(item => item.length < 50)
  } catch (e) {
    return []
  }
}
export async function loadModulesList(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        if (data) {
          data = data.split('var moduleMap = ').length > 1 ? data.split('var moduleMap = ')[1] : data.split('var moduleMap = ')[0]
          data = data.split('var get = ')[0]
          data = data.match(new RegExp('"./(.*?)":', 'gi'))
          data = data.map(item => item.replace('":', '').replace('"./', ''))
          const res = data.filter(item => item.length < 50)
          resolve(res)
        } else {
          resolve([])
        }
      })
      .catch(error => {
        resolve([])
        console.error(`${url}加载失败`, error)
      })
  })
}
