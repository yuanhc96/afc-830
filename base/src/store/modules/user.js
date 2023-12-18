import {
  getAppPermissions,
  getObjectPermissions,
  getPermissions,
  iamLogout,
  logout,
  refreshUserObject
} from "@/api/login"
import {
  getToken,
  isIAM,
  removeLoginType,
  removeToken,
  setToken
} from "@/utils/auth"
import { localStore } from "@/utils/sessionStore"
import { getQueryVariable } from "@/utils/tools"
import {
  dealWaterMark,
  findWaterMark,
  getWaterMarkWhiteEmps
} from "@/utils/watermark"
import { removeOriginUrl } from "../../utils/auth"
// const treeToArr = (tree, arr = [], parent) => {
//   arr = arr.concat(tree.map(d => {
//     return {
//       code: d.menuCode,
//       name: d.menuName,
//       url: d.linkAction,
//       parent: parent,
//     }
//   }))

//   tree.forEach(t => {
//     debugger
//     if (t.childrenMenuTreeNodeList && t.childrenMenuTreeNodeList.length > 0) {
//       debugger
//       t.children = treeToArr(t.childrenMenuTreeNodeList, [], t.menuCode)
//     }
//   })
//   return arr
// }
const menuIcon = (path) => {
  if (path && path.indexOf("fa-") > -1) {
    return undefined
  } else {
    return path
  }
}
const wrapperMenuData = (menus, type = "paltform") => {
  menus = menus.filter((menu) => menu.menuType !== "mobile")
  menus = _.sortBy(menus, (t) => t.sortNo)

  menus = menus.map((d) => {
    const content = d.resource ? JSON.parse(d.resource.content) : null
    let query = content ? content.query : null
    let prePath = ""
    if (d.parentId === "root" || d.parentId === "objectMenu") {
      prePath = "/"
    } else if (d.parentId === "appRoot") {
      prePath = `/app/`
    }
    if (type === "app") {
      query = query ? `${query}&appId=${d.appId}` : `appId=${d.appId}`
    }
    return {
      // path: `${d.parentId === 'root'  || d.parentId === 'appRoot' || d.parentId === 'objectMenu' ? '/' : ''}${d.code || '/'}`,
      path: `${prePath}${d.code || "/"}`,
      // redirect: 'noredirect',
      alwaysShow: d.code === "portal_public" ? false : true, //隐藏门户设置菜单
      name: d.code,
      query: query || null,
      meta: {
        resource: d.resource,
        title: d.name,
        icon: menuIcon(d.menuIcon) || "",
        iconColor: d.description
      },
      isNewWindowOpen:
        d.isNewWindowOpen === "newOpenWindow" || d.isNewWindowOpen === "1",
      isFullScreenShow: d.isNewWindowOpen
        ? d.isNewWindowOpen.trim() === "fullScreen"
        : false,
      parentId: d.parentId,
      id: d.id,
    }
  })
  menus.forEach((menu) => {
    const parent = menus.find((p) => p.id === menu.parentId)
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(menu)
    }
  })
  const tree = menus.filter(
    (menu) =>
      menu.parentId === "root" ||
      menu.parentId === "objectMenu" ||
      menu.parentId === "appRoot"
  )
  tree.forEach((menu) => {
    if (menu.children && menu.children.length) {
      //递归找到children下第一个有Resource的节点，获取query
      const resourceNode = findResourceNode(menu);
      const query = resourceNode ? resourceNode.query : null
      menu.query = query ? query : menu.query
      menu.children = menu.children.map((item) => {
        return {
          ...item,
          showIcon: true,
        }
      })
    }
    // 加一条数据，含有meta.resource 且 menu.parentId === 'root' || menu.parentId === 'objectMenu'
    if (menu.meta.resource) {
      if (!menu.children) {
        menu.children = []
      }
      if (!menu.isNewWindowOpen) {
        menu.children.unshift({
          ...menu,
          parentId: menu.id,
          id: new Date(),
          path: "index",
          children: null,
          hiddenMenu: true,
        })
      }
    }
  })
  // console.log('tree',tree)
  return tree
  const result = tree.map((d) => {
    const children =
      d.children &&
      d.children.map((c) => {
        // console.log('获取菜单', c)
        let _children = null
        if (c.children && c.children.length > 0) {
          _children = wrapperMenuData(c.children)
        }
        return {
          path: c.code,
          name: c.code,
          component: c.code,
          children: _children,
          meta: {
            origin: c.menuAction,
            urlJson: c.urlJson,
            title: c.name,
            icon: menuIcon(c.imagePath),
          },
        }
      })
    // let children = []
    // if(d.childrenMenuTreeNodeList && d.childrenMenuTreeNodeList.length > 0){
    //  children = wrapperMenuData(d.childrenMenuTreeNodeList)
    // }
    return {
      path: `${root ? "/" : ""}${d.code}`,
      // redirect: 'noredirect',
      alwaysShow: true,
      name: d.code,
      meta: {
        title: d.name,
        icon: menuIcon(d.imagePath) || "org",
      },
      children: children,
    }
  })
  return result
}

function findResourceNode(data) {
  if (!data) {
    return null;
  }
  if (data.meta && data.meta.resource !== null) {
    return data;
  }
  if (data.children) {
    for (const child of data.children) {
      const foundNode = findResourceNode(child);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

const user = {
  state: {
    user: "",
    status: "",
    code: "",
    token: getToken(),
    redirectUrl: "",
    name: "",
    avatar: "",
    introduction: "",
    roles: [],
    setting: {
      articlePlatform: [],
    },
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_USER: (state, user) => {
      // debugger
      state.user = user
      localStore.set("user", user === null ? null : user)
    },
    SETUSERINFO: (state, info) => {
      state.userInfo = info
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      localStore.set("roles", roles)
    },
  },

  actions: {
    setUser({ commit }, userInfo) {
      commit("SET_USER", userInfo)
    },
    async setUserInfo({ commit }, info) {
      console.log("来了老弟。。。。。。。。。。。。。。")
      ajaxUtil
        .ajax({
          url: "org.gocom.components.coframe.auth.LoginManager.getUserPool.biz.ext",
          method: "post",
          data: {
            uniqueId: localStore.get("uniqueId"),
          },
        })
        .then((res) => {
          localStorage.setItem(
            "putuo_userInfo",
            JSON.stringify(res.data.userObject || "")
          )
          commit("SETUSERINFO", JSON.parse(res.data.userObject))
        })
        .catch(() => {
          commit("SETUSERINFO", "")
        })
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        if (userInfo.code) {
          // setToken('pass')
          setToken(userInfo.uniqueId)
          localStore.set("uniqueId", userInfo.uniqueId)
          localStore.set("user", userInfo)
          localStore.set('isobjectMenu', false)
          // 用户超时切换账户，如果不是同一用户，不在跳回原来的页面
          if(localStore.get('userCode') && localStore.get('userCode') !== userInfo.code) {
            removeOriginUrl()
          }
          localStore.set('userCode', userInfo.code)
          resolve()
        } else {
          removeToken()
          reject()
        }
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userId = null
        const isobjectMenu = localStore.get("isobjectMenu")
        const appId = getQueryVariable("appId")
        console.log(appId, "appId")
        if (appId) {
          // 应用菜单
          getAppPermissions({ appId: appId })
            .then((res) => {
              if (res[0].data.exception) {
                reject(error)
                return
              }
              commit("ADD_APPMENUS", {
                key: appId,
                value: res[0].data.length
                  ? wrapperMenuData(res[0].data, "app")
                  : [],
              })
              let platformFun = res[2].data
              platformFun = [...new Set(platformFun.concat(res[1].data))]
              commit("SET_FUNCTIONS", platformFun)
              if (localStore.get("user")) {
                commit("SET_USER", localStore.get("user"))
              }
              resolve(res)
            })
            .catch((error) => {
              console.error(error)
              reject(error)
            })
        } else if (isobjectMenu) {
          const businessObjId = localStore.get("businessObjId")
          const businessObjInstId = localStore.get("businessObjInstId")
          const payload = {
            businessObjId: businessObjId,
            businessObjInstId: businessObjInstId,
          }
          getObjectPermissions(payload, payload, state.token || getToken())
            .then((res) => {
              if (res[0].data.exception) {
                reject(error)
                return
              }
              commit("SET_MENUS", wrapperMenuData(res[0].data, true))
              let platformFun = res[2].data
              platformFun = [...new Set(platformFun.concat(res[1].data))]
              commit("SET_FUNCTIONS", platformFun)
              if (localStore.get("user")) {
                commit("SET_USER", localStore.get("user"))
              }
              resolve(res)
            })
            .catch((error) => {
              console.error(error)
              reject(error)
            })
        } else {
          // 更新用户权限
          refreshUserObject(userId, state.token || getToken())
            .then(({ data }) => {
              const { uniqueId } = data
              const user = {
                ...localStore.get("user"),
                ...data,
                sessionId: uniqueId,
              }
              localStore.set("uniqueId", uniqueId)
              commit("SET_USER", user)
              getPermissions(userId, state.token || getToken())
                .then((response) => {
                  if (response[0].data.exception) {
                    reject(error)
                    return
                  }
                  // debugger
                  commit("SET_NAME", "system")
                  commit("SET_AVATAR", "")
                  commit("SET_INTRODUCTION", "")
                  commit("SET_MENUS", wrapperMenuData(response[0].data, true))
                  commit("SET_FUNCTIONS", response[1].data)

                  // 获取水印信息
                  const payload = {}
                  findWaterMark(payload).then((res) => {
                    localStore.set("watermark", res.data)
                    dealWaterMark()
                  })
                  // 获取水印白名单
                  const query = { pageIndex: 0, pageSize: 999 }
                  getWaterMarkWhiteEmps(query).then((res) => {
                    const emplists = res.data.data.map((i) => i.employee.id)
                    localStore.set("watermarkmwhiteListEmps", emplists)
                  })
                  resolve(response)
                })
                .catch((error) => {
                  console.error(error)
                  reject(error)
                })
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        if (isIAM()) {
          const p = await iamLogout()
          removeLoginType()
          window.location.href = p.data.logoutUrl
          return
        } else {
          logout(state.token).then(() => {})
          user.actions.FedLogOut({ commit })
          resolve()
        }
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(async (resolve, reject) => {
        commit("SET_TOKEN", "")
        commit("SET_ROLES", [])
        commit("SET_USER", null)
        commit("SET_PLATFORM", null)
        commit("SET_MENUS", [])
        commit("SET_FUNCTIONS", [])
        commit("SET_ROLES", [])
        localStore.set("isobjectMenu", false)
        localStore.set("watermark", null)
        localStore.set("watermark", null)
        removeToken()
        removeLoginType()
        // window.location.href = '/' //登出时多刷新了一次, 先注释掉
        resolve()
      })
    },
  },
}

export default user
