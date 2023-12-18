const data = new Map()
const queue = {}
export default {
  get: (key) => {
    return data.get(key)
  },
  set: (key, value) => {
    data.set(key, value)
  },
  clear: () => {
    data.clear()
  },
  has: (key) => {
    return data.has(key)
  },
  push: (key, target) => {
    queue[key] = []
  }
}
