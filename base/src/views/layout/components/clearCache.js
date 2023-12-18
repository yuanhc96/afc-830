// 移除keep-alive缓存
function getVnode(context) {
    if (context.$children.length === 0) return false
    let vnode = null
    for (const item of context.$children) {
        if (item.$vnode.data.key) {
            vnode = item.$vnode
            break
        }
    }
    return vnode || false
}
function removeOtherCache(context, otherView) {
    const vnode = getVnode(context)
    if (!vnode) return false
    const componentInstance = vnode.parent.componentInstance;
    Object.keys(componentInstance.cache).forEach((key, i) => {
        console.log(otherView, key)
        if (!otherView.includes(key)) { // 清除除了 otherView 外的所有缓存
            if (componentInstance.cache[key]) {
                componentInstance.cache[key].componentInstance.$destroy()
            }
            delete componentInstance.cache[key]
            componentInstance.keys.splice(i, 1)
        }
    })
}

export {
    removeOtherCache
}