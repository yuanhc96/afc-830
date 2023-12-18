<template>
  <el-dialog title="国际化配置" :visible.sync="i18nDialogVisible" width="800px" height="500px" append-to-body
    :before-close="handleClose">
    选择导出语言类型 <el-tooltip class="item" effect="dark" content="不选默认导出全部语言类型" placement="top">
      <i class="el-icon-info"></i>
    </el-tooltip>
    <el-select v-model="selectlangs" multiple collapse-tags clearable placeholder="请选择" style="margin-bottom: 10px;">
      <el-option v-for="item in langOptions" :key="item.code" :label="item.name" :value="item.code">
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-bottom: 10px;" :loading="exporti18nLoading" :disabled="selectExportData.length==0" @click="exporti18nData"> 国际化导出</el-button>
    <vxe-table border stripe resizable ref="i18nTable" show-overflow :data="tableData" style="min-height: 400px;"
      :edit-config="{ trigger: 'click', mode: 'row' }" :checkbox-config="{ visibleMethod: showCheckboxk }" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent"> 
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column v-for="item of columns" :field="item.field" :title="item.title"
        :edit-render="item.field === 'name' ? '' : {}">
        <template #edit="{ row }">
          <vxe-input v-model="row[item.field]" type="text"></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitData">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { DictTypeController, GeneralI18nController } from "@controller"
import { BaseVue, List, VueUtil, _ } from "@lib"
import ajaxUtil from "@lib/ajaxUtil"
import FileSaver from "file-saver"
import { mapGetters } from "vuex"
export default {
  mixins: [BaseVue, List],
  props: {
    i18nDialogVisible: {
    type: Boolean,
    default: false
  },
  selectMenus: {
    type: Object,
    default: []
  },
  mark:{},
  entityName:{}
  },
  data() {
      return {
        dicttypeid: "sys_i18n_locale",
        tableData:[],
        i18nArray:[],//存有哪些语言 ['zh','en']
        columns:[ 
          {
            title:'名称',
            field:'name'
          },
        ],
        i18nAllData:[],
        langOptions:[],
        selectlangs:'',
        selectExportData:[],
        exporti18nLoading:false
      }
    },
  mounted(){
    this.init()
    
    },
  watch:{
    dicts: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.langOptions = objectType.filter(item=>item.code!=='zh_CN')
           for (const item of objectType) {
            if(item.code!== 'zh_CN'){
              this.i18nArray.push(item.code)
              this.columns.push({title:item.name,field:item.code})
            }
            
           } 
        }
      }
    },
  },
  computed: {
    ...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([ DictTypeController])
      .state(),
  },
  methods:{
   async init(){
     await this.searchI18nData()
     await this.loadDictData()
     this.dealData()
    },
    showCheckboxk ({ row }) {
      let isShow = false
      this.i18nArray.forEach(element => {
        if(row[element]) {isShow =true}
      })
      return isShow

    },
     dealData(){
      this.tableData = _.cloneDeep(this.selectMenus).map(item=>{
        return {
          code:item.code,
          name:item.name
        }
      })
      for(let item of this.tableData){
      const resp =  this.searchI18nDatabyCode(item.code)
      if(resp.length>0){
        for(let obj of resp){
          item[obj.locale] = obj.value
        }
       }
      }
    },
    searchI18nDatabyCode(code){ 
      return this.i18nAllData.filter(item=>{
        return item.code === code
      })
    },
    async searchI18nData(){
      const resp = await this.dispatch(GeneralI18nController.queryWithPage, {
          propertyName: 'name',
          codes:[...this.selectMenus.map(item=>{return item.code})],
          entityName: this.entityName,
          pageIndex:0,
          pageSize:-1,
          tenantId: this.currentTenant
        })
      if(!resp.error){
        this.i18nAllData = resp.data.data
      }
    },
    async loadDictData() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts[this.dicttypeid]) {
        const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
          code: this.dicttypeid,
          tenantId: this.currentTenant
        })
        if (!resp.error) {
          this.$store.commit("ADD_DICT", {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : []
          })
        }
      }
    },
    async submitData(){
      const submitDataArray = this.dealSumbitData()
      const resp = await this.dispatch(GeneralI18nController.save, {generalI18ns:_.cloneDeep(submitDataArray)})
      if(!resp.error){
        this.$msg.success("保存成功")
        this.$emit('update:i18nDialogVisible',false)
        this.$emit('i18nSuccess','')
      }
    },
    selectAllEvent ({ checked }) {
              const records = this.$refs.i18nTable.getCheckboxRecords()
             this.selectExportData = records
    },
    selectChangeEvent ({ checked }) {
              const records = this.$refs.i18nTable.getCheckboxRecords()
              this.selectExportData = records              
   },
   async exporti18nData(){
      this.exporti18nLoading = true
      ajaxUtil.config.responseType = "blob";
      let payload = {
        codes:this.selectExportData.map(item=>{return item.code})
      };
      payload.params = {locales:this.selectlangs}
      const resp = await this.dispatch(
        GeneralI18nController.exportI18nMessages,
        payload
      );
      ajaxUtil.config.responseType = "json";
      if (!resp.error) {
        const blob = new Blob([resp.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8",
        });
          FileSaver.saveAs(blob, `${this.entityName}国际化资源.xlsx`);
      }
      this.exporti18nLoading = false

   },
    dealSumbitData(){
      const submitDataArray = []
      for(let object of this.tableData){
        for(let objItem in object){
         if(this.i18nArray.includes(objItem)){
          submitDataArray.push({
            propertyName: 'name',
            code: object.code,
            entityName: this.entityName,
            locale: objItem,
            tenantId: this.currentTenant,
            value: object[objItem]
          })
         }
        }
      }
      return submitDataArray
    },
    handleClose(){
      this.$emit('update:i18nDialogVisible',false)
      this.tableData = []
    }
  }
  }
</script>