// 加载字体文件
import md5 from 'md5'
export default {
    dynamicLoadCss(url) {
        const id = md5(url).substring(0, 6)
        if(document.getElementById(id)) {
            return
        }
        console.log('加载 css 文件', url)
        var head = document.getElementsByTagName('head')[0]
        var link = document.createElement('link')
        link.id = id
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.href = url
        head.appendChild(link)
    }
}
