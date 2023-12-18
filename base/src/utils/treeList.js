
// list转化为树
export function listToTree(arr) {
  const result = []
  const map = new Map()
  arr.forEach(item => {
    map.set(item.id, item)
  })
  for (let item of arr) {
    if (map.has(item.parentId)) {
      if (!map.get(item.parentId).children) {
        map.get(item.parentId).children = []
      }
      map.get(item.parentId).children.push(item)
    } else {
      result.push(item)
    }
  }
  return result
}

/**
 * 
 * @param {*} data 树
 * @param {*} isLeaf 是否只获取叶子节点
 * @returns 
 */
export function treeToList(data, isLeaf = false) {
  const tree = JSON.parse(JSON.stringify(data))
  var queen = [];
  var out = [];
  queen = queen.concat(tree);
  while (queen.length) {
    var first = queen.shift();
    if (first.children) {
      // 下一层节点推入
      queen = queen.concat(first.children)
      // delete first['children'];
    }
    if(isLeaf) {
      if(!first.children?.length) {
        out.push(first);
      }
    } else {
      out.push(first);
    }
    
   
  }
  return out;
}

// 根据叶子结点获取整棵树
export function getTreeListByLeaf(children, treeList) {
  const list = JSON.parse(JSON.stringify(treeList))
  const result = [];
  const getResult = (findItem) => {
    const parentItem = list.filter((item)=>item.id === findItem.parentId)[0]
    if(parentItem) {
      delete parentItem.children;
      if(!result.includes(parentItem)) {
        result.push(parentItem)
      }
      getResult(parentItem)
    }
  }
  children.forEach((findItem)=>{
    getResult(findItem);
  })
  const childrenWithLeaf = children.map((ele)=>{
    return {
      ...ele,
      isLeaf: true
    }
  })
  return result.concat(childrenWithLeaf)
}
// 根据当前结点获取该结点路径
export function getLink(treeList, findItem) {
  const list = JSON.parse(JSON.stringify(treeList))
  const result = [];
  const getResult = (findItem) => {
    const parentItem = list.filter((item)=>item.id === findItem.parentId)[0]
    if(parentItem) {
      // delete parentItem.children;
      if(!result.includes(parentItem)) {
        result.push(parentItem)
      }
      getResult(parentItem)
    }
  }
  getResult(findItem);
  result.reverse().push(findItem);
  return result;
}

