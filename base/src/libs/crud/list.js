import moment from 'dayjs'
import { cloneDeep, isArray, sum } from 'lodash'
function getParentClientTop(dom, tops = []) {
  if (dom) {
    tops.push(dom.offsetTop)
    getParentClientTop(dom.parentElement, tops)
  }
}
function removeDuplicates(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr.splice(i + 1, 1)
      i--
    }
  }
  return arr
}
export default {
  computed: {
    gridList() {
      if (this.gridData) {
        if (!isArray(this.gridData)) {
          let arr = []
          Object.keys(this.gridData).forEach(key => {
            if (isArray(this.gridData[key])) {
              arr = this.gridData[key]
            }
          })
          return arr
        } else {
          return this.gridData
        }
      } else {
        return []
      }
    },
    gridTotal() {
      if (this.gridData && !isArray(this.gridData)) {
        return this.gridData.totalElements || this.gridData.total
      } else return 0
    },
    isShowPaging() {
      return this.gridTotal > 10
    },
    tableId() {
      return `table_` + this._uid
    },
    autoTableHeight() {
      return `calc(100vh - ${this.topBarHeight})`
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectRow: null,
      orderby: [],
      sortBy: [],
      selections: [],
      gridData: {
        data: [],
        total: 0,
      },
      query: {
        limit: 10,
        offset: 1,
      },
      topBarHeight: '200px',
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.selectRow = null
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.calculateTableHeight()
    }, 20)
  },
  methods: {
    calculateTableHeight() {
      if (document.getElementById(this.tableId)) {
        const table = document.getElementById(this.tableId)
        const tops = []
        getParentClientTop(table, tops)
        removeDuplicates(tops)
        const offsetTop = sum(tops)
        console.log('top', offsetTop, tops)
        this.topBarHeight = (offsetTop + 69) + 'px'
      }
    },

    async changePageSizer(pageSize) {
      this.query.limit = pageSize
      this.changePage()
    },

    createCriteria(Criteria, query) {
      const cri = cloneDeep(Criteria)
      cri.criteria._and.forEach(and => {
        and._expr.forEach(expr => {
          if (query[expr._property]) {
            if (expr._min === '' && expr._max === '') {
              if (query[expr._property][0]) {
                expr._min = moment(query[expr._property][0]).format(expr.partten || 'YYYY-MM-DD')
              }
              if (query[expr._property][1]) {
                expr._max = moment(query[expr._property][1]).format(expr.partten || 'YYYY-MM-DD')
              }
            } else {
              expr._value = query[expr._property]
            }
          }
        })
      })
      cri.criteria._and.forEach(and => {
        and._expr = and._expr.filter(expr => query[expr._property])
      })
      cri.criteria._orderby = this.orderby
      cri.pageIndex = query.offset - 1
      cri.pageSize = query.limit
      cri.page = {
        begin: cri.pageIndex * cri.pageSize,
        length: cri.pageSize
      }
      return cri
    },
    // async sortChange (sort) {
    //   if (sort.prop) {
    //     this.orderby = [{
    //       '_property': sort.prop,
    //       '_sort': sort.order.replace('ending', '')
    //     }]
    //     this.sortBy = {
    //       sortField: sort.prop,
    //       sortOrder: sort.order.replace('ending', ''),
    //     }
    //   } else {
    //     this.orderby = []
    //   }
    //   this.search()
    // },
    async sortChange(sort) {
      if (sort.prop) {
        this.orderby = [{
          '_property': sort.prop,
          '_sort': sort.order.replace('ending', '')
        }]
        this.sortBy = {
          orderFields: sort.prop,
          orderDirection: sort.order.replace('ending', '').toUpperCase(),
        }
      } else {
        this.orderby = []
      }
      this.search()
    },
    otherQuery(data) {
      return {
        ...data,
        ...this.sortBy,
        // pageIndex: data.offset,
        // pageSize: data.limit,
        // page: {
        //   begin: (data.offset - 1) * data.limit,
        //   length: data.limit,
        // }
      }
    },
    format(data, partten) {
      if (data) {
        return moment(data).format(partten)
      }
    },
    openAdd() {
      this.dialogVisible = true
    },
    openEdit(row) {
      this.selectRow = row
      this.dialogVisible = true
    },
    remove(row, message) {
      this.$confirm(message || '此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          if (this.removeBody) {
            const resp = await this.removeBody.call(this, row)
            if (!resp.error) {
              this.pmSearch && this.pmSearch.call(this)
              this.removeSuccess && this.removeSuccess.call(this, row)
            }
          }
        })
        .catch(() => {
          this.removeReject && this.removeReject.call(this, row)
        })
    },
    batchOperate(command) {
      if (command === 'batchRemove') {
        if (this.selections && this.selections.length > 0) {
          this.remove(this.selections)
        }
      }
    },
    checkboxAll({ $table }) {
      this.selections = $table.getCheckboxRecords()
    },
    checkboxChange({ $table }) {
      this.selections = $table.getCheckboxRecords()
    },
    selectionChange(selections) {
      this.selections = selections
    },
    async changePage(index) {
      this.query = {
        ...this.query,
        offset: index || 1
      }
      this.search()
    },
    // 高级搜索时 页码重置为1
    pmSearch() {
      this.query = {
        ...this.query,
        offset: 1
      }
      this.search()
    },
    async search(page) {
      // var expandBoxHeght = document.getElementById('expand-box')
      // if (!expandBoxHeght) {
      //   return false
      // }
      // if (expandBoxHeght.style.display === 'block') {
      //   this.closeSearch()
      // }
      if (!isNaN(page)) {
        this.query.offset = page <= 0 ? 1 : page
      }
      if (this.searchBody) {
        const resp = await this.searchBody.call(this)
        if (resp) {
          return (this.gridData = resp.data)
        } else {
          return null
        }
      }
      return null
    },
    // 查询条件重置
    resetSearchForm() {
      this.$refs.searchForm.resetFields()
    },
    // 打开/关闭高级搜索
    closeSearch() {
      this.showAll = !this.showAll
      var expandBoxHeght = document.getElementById('expand-box')
      if (!expandBoxHeght) {
        return false
      }
      var appMain = document.getElementById('appMain')
      if (this.showAll === false) {
        var shadow_div = document.getElementById('shadowDiv')
        if (!shadow_div) {
          return false
        }
        shadow_div.style.display = 'none'
        expandBoxHeght.style.display = 'none'
        appMain.removeChild(shadow_div)
        // this.loading.close();
      } else {
        expandBoxHeght.style.display = 'block'
        //  添加遮罩
        // 新建新的遮罩id
        var shadowDiv = document.createElement('div')
        shadowDiv.className = 'shadow-div'
        shadowDiv.id = 'shadowDiv'
        appMain.appendChild(shadowDiv)
        shadowDiv.style.display = 'block'
        shadowDiv.onclick = () => {
          this.showAll = !this.showAll
          var shadow_div = document.getElementById('shadowDiv')
          shadow_div.style.display = 'none'
          expandBoxHeght.style.display = 'none'
          appMain.removeChild(shadow_div)
        }
        // this.loading = this.$loading({
        //   lock: true,
        //   text: '',
        //   spinner: 'el-icon-search',
        //   background: 'rgba(0, 0, 0, 0.3)',
        //   target: document.querySelector('.app-main'),
        // });
      }
    },
  },
  destroyed() {
    this.showAll = true
    this.closeSearch()
  }
}
