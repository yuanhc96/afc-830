<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24" class="text-right">
          <div class="selectUser_search">
            <PmSearch
              :query.sync="query"
              defaultProp="name"
              @search="pmSearch"
              placeholder="搜索角色名称"
            >
              <template slot="body">
                <el-form-item label="角色编号" prop="code">
                  <el-input v-focus v-model="query.code" clearable />
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="query.name" clearable />
                </el-form-item>
              </template>
            </PmSearch>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="block">
      <pm-table
        ref="pmTable"
        checked
        :stripe="false"
        :height="height"
        :columns="columns"
        :tableData="gridList"
        :autoSelectRow="false"
        :header-cell-class-name="headerHandler"
        :cell-class-name="classHandler"
        @select="selectChange"
        @select-all="selectAll"
      >
      </pm-table>
    <el-pagination
      class="pagination"
      background
      :page-size.sync="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      :page-sizes="[10, 20, 30, 40, 50]"
      @size-change="changePageSizer"
      @current-change="changePage"
      layout="total,prev, pager,next, sizes"
    />
    </div>
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import { RoleController } from "@controller";
export default {
  name: "",
  components: {},
  mixins: [BaseVue, List],
  props: {
    selectedRows:[], //右边选中的所有
    data:[],
    height:{
      default:function(){
        return "349px"
      }
    },
    dialogqueryFun:{},
    orgData:{},
    businessObjId:{
      type:String,
    }
  },
  data() {
    return {
      columns: [
        { label: "编码", prop: "code", },
        { label: "名称", prop: "name" },
        // { label: "描述", prop: "description",width:"70" },
      ],
    };
  },
  watch: {
    gridList(value){
      this.$emit("update:data",value)
      this.$nextTick(()=> {
        this.selectedRows.forEach(i => {
          const selected = this.gridList.filter(j => j.id === i.id)
          if (selected.length) {
            this.$refs.pmTable.$refs.myTable.toggleRowSelection(selected[0], true)
          }
        })
      })       
    }
  },
  computed: {},
  mounted() {
    this.search();
  },
  methods: {
    headerHandler(cell){
     if(cell.column.type==="selection") {
       return "selection"
     }
    },
    classHandler(cell){
     if(cell.column.type==="selection") {
       return "selection"
     }
    },
    // 列表 选择改变
    selectChange(selection, row) {
      let selected = _.cloneDeep(this.selectedRows)
      if (selection.some(i => i.id === row.id)) {
        selected.push(row)
      } else {
        
        const index = _.indexOf(selected.map(i => i.id), row.id)
        selected.splice(index, 1)
      }
      this.$emit("update:selectedRows", selected)
    },
    selectAll(selection) {
      let selected = _.cloneDeep(this.selectedRows)
      if (selection.length) {
        selection.forEach(i => {
          const isExit = selected.every(j => i.id !== j.id)
          if (isExit) {
            selected.push(i)
          }
        })
      } else {
        this.gridList.forEach(i => {
          selected.forEach(j => {
            if (i.id === j.id) {
              const index = _.indexOf(selected.map(k => k.id), i.id)
              selected.splice(index, 1)
            }
          })
        })
      }
      this.$emit("update:selectedRows",selected)
    },
    toggleSelections(type) {
      if (type.id) {
        // 右边点击删除
        this.$nextTick(()=> {
          const selected = this.gridList.filter(j => j.id === type.id)
          if (selected.length) {
            this.$refs.pmTable.$refs.myTable.toggleRowSelection(selected[0], false)
          }
        }) 
      } else {
        this.$refs.pmTable.$refs.myTable.clearSelection()
        if (type === 'all') {
          this.$refs.pmTable.toggleSelection(this.gridList)
        }
      }
    },
    async searchBody() {
       if(this.dialogqueryFun){
        const resp = await this.dialogqueryFun.call(this,{orgId:this.orgData.id,...this.query})
        // resp.data.data = resp.data.data.map(i=>{return i.role})
        
        return  resp
       }
      let query = this.otherQuery(this.query);
      let payload = { type:"platform", ...query };
      if(this.businessObjId){
        payload = { ...payload,businessObjId:this.businessObjId,type:'businessObject' }
      }
      const resp = await this.dispatch(
        RoleController.queryRolesWithPage,
        payload
      );
      return resp;
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .selection{
  .cell {
    padding: 0px!important;
    text-align: center;
  }
}
.block {
    height: 400px;
    overflow: auto;
    border: 1px solid #ddd;
    border-top: none;
  }
  .pagination{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: right;
    border: none !important;
}
</style>
