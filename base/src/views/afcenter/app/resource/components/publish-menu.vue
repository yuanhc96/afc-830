<template>
  <el-dialog
      v-if="dialogVisible"
      title="发布菜单"
      :visible.sync="dialogVisible"
      width="800px"
      height="600px"
      top="60px"
      append-to-body
      :before-close="handleClose"
    >
    <div>
    <el-form ref="form" class="new-form" label-position="top" :model="form" label-width="120px" :rules="validateRules" size="mini">
      <el-row :gutter="22">
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType" class="pb-15">
        <el-radio-group v-model="form.menuType">
          <el-radio label="platform">平台菜单</el-radio>
          <el-radio label="app">当前应用菜单</el-radio>
        </el-radio-group>
      </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PC/移动端菜单" prop="mark" class="pb-15">
      <el-radio-group v-model="form.mark">
        <el-radio label="pc">PC</el-radio>
        <el-radio label="mobile" :disabled="mobileDisabled">移动端</el-radio>
      </el-radio-group>
    </el-form-item>
        </el-col>
    <el-col :span="12">
      <el-form-item label="绑定角色" prop="role" class="pb-15">
      <el-input
      v-if="dialogVisible"
      v-model.trim="roleShowString"
      :key="resourse.id"
      readonly
      class="w-100p"
      placeholder="选择绑定角色"
    >
      <el-button
        slot="append"
        v-bind="$attrs"
        type="primary"
        icon="el-icon-more"
        @click="openSelectRole"
      />
    </el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="父菜单" prop="parentMenu" class="pb-15">
      <Menutree  v-if="dialogVisible" :mark="form.mark" :appId="form.menuType === 'app' ? currentApp.id : ''"  :menuForm="form" @selectParentNode="selectParentNode" />
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="是否叶子菜单" prop="isLeaf" class="pb-15">
      <el-select v-model="form.isLeaf" placeholder="请选择" :disabled="isDisabled || true" style="width: 100%">
        <el-option v-for="item in switchOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="打开模式" v-if="form.parentMenu.id === 'root' && form.mark === 'pc'" prop="isNewWindowOpen" class="pb-15">
      <el-select clearable v-model="form.isNewWindowOpen" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in openTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="菜单编号" prop="menuCode" class="pb-15">
      <el-input v-model.trim="form.menuCode" width="100%"> </el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="菜单名称" prop="menuName" class="pb-15">
      <el-input v-model.trim="form.menuName" width="100%"> </el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="菜单图标" prop="icon" class="pb-15">
      <PmSelectIcon v-model="form.icon" placeholder="请选择菜单图标" />
    </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="菜单显示顺序" prop="sortNo" class="pb-15">
      <el-input v-model="form.sortNo" type="number" min="1" max="99" />
    </el-form-item>
    </el-col>
  </el-row>

  </el-form>
  <select-types
      :dialog-visible.sync="selectDialogVisible"
      :isMultiple="true"
      :partyTypes="partyTypes"
      title="添加角色"
      @sure="handleSuccess"
  ></select-types>
  </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
    </span>
    </el-dialog>

</template>
<script>
import { AppController, MenuController } from '@controller'
import { BaseVue, List } from "@lib"
import localStore from 'store'
import Menutree from './publish-menu-tree.vue'
export default {
  components: { Menutree },
  mixins: [BaseVue, List],
  props: {
    resourseId: {
      type: String,
      default: '',
    },
    dialogVisible: {},
    resourse: {
      default: null,
    },
    appCode:{
      default:null
    }
  },
  data() {
    let nameTimer = null
    var checkParentMenu = (rule, value, callback) => {
      if (!this.form.parentMenu.id) {
        return callback(new Error('父菜单不能为空!'))
      }
      callback()
    }
    var checkRole = (rule, value, callback) => {
      if (this.selectRoles.length == 0) {
        return callback(new Error('请选择绑定角色!'))
      }
      callback()
    }
    return {
      currentApp:{},
      selectDialogVisible:false,
      partyTypes: [],
      roleShowString:'',
      selectRoles:[],
      form: {
      },
      dicttypeid: 'BI_RESOURCE_TYPE',
      dictType: {},
      statusOptions: [],
      viewOptions: [],
      openTypeOptions: [
        {
          code: 'fullScreen',
          name: '全屏模式',
        },
      ],
      switchOptions: [
        {
          code: '0',
          name: '否',
        },
        {
          code: '1',
          name: '是',
        },
      ],
      appName: this.appCode,
      validateRules: {
        menuCode: [
          { required: true, message: '请输入菜单编号!', trigger: 'change' },
          {
            validator: (rule, value, callback, source, options) => {
              if (value && /[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('编码不能输入汉字'))
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (!value) {
                callback()
              } else {
                nameTimer = setTimeout(async () => {
                  const res = await this.dispatch(MenuController.isExist, {
                    code: value,
                    tenantId: this.currentTenant,
                  })
                  if (res.data == true) {
                    callback(new Error(`${value}编码已存在!`))
                  }
                  callback()
                }, 300)
              }
            },
          },
        ],
        menuName: [{ required: true, trigger: 'blur', message: '菜单名称不能为空!' }],
        parentMenu: [{ required: true, validator: checkParentMenu, trigger: 'change' }],
        role: [{ required: true, validator: checkRole, trigger: 'blur' }],
        formxStatus: [{ required: true, trigger: 'blur', message: '表单状态不能为空!' }],
      },
      contributionList: [],
      entityList: [],
    }
  },
  mounted() {},
  computed: {
    isMobileLeaf() {
      return this.form.mark === 'mobile' && (this.form.parentMenu.id === 'root' || this.form.parentMenu.id === 'appRoot')
    },
    isDisabled() {
       const res = this.isMobileLeaf || this.form.parentMenu.id == 'root' || this.form.parentMenu.id === 'appRoot'
       if(res){
        this.form.isLeaf = '0'
       } 
       return res
    },
    currentTenant() {
      return this.userInfo && this.userInfo.attributes && this.userInfo.attributes['TENANT_ID']
    },
    userInfo() {
      return localStore.get('user') || {}
    },
    mobileDisabled(){
      let content = {}
      if (this.resourse){
         content = JSON.parse(this.resourse.content)
      }
      return content.openType === 'afcenter' ?  true : false
    }
  },
  watch: {
    dialogVisible:{
      immediate:true,
      async handler(val){
        if(val){
          this.reset()
          this.currentApp = await this.findAppByCode()
        }
      }
    }
  },
  methods: {
    openSelectRole(){
      this.partyTypes = this.form.menuType === 'app' ? [{ code: "role_app", name: "应用角色",appId:this.currentApp.id }] :
      [{ code: "role", name: "平台角色" }] ,
      this.selectDialogVisible = true
    },
    async handleSuccess(selects) {     
      this.roleShowString = selects && selects.length ? selects.map(item=>{
        return item.name
      }).join() : ""
      this.selectRoles = selects
    },
    selectParentNode(node) {
      this.form.parentMenu = node.data
    },
    reset() {
      this.form = {
        resType: 'formx',
        formxStatus: 'create',
        resCode: null,
        view: 'view',
        mark: 'pc',
        menuType:'platform',
        icon:"",
        menuCode: this.resourse.code,
        menuName: this.resourse.name,
        parentMenu: {},
        isLeaf: '1',
        sortNo: 3,
        isNewWindowOpen: '',
        biId: null,
        biType: null,
        bicode: null,
      }
      this.roleShowString = ''
      this.selectRoles = []
    },
    async findAppByCode() {
      const res = await this.dispatch(AppController.findAppByIdOrCode, {
        code: this.appName,
      })
      return res.data
    },
    async save() {

      const menu = {
        id: null,
        name: this.form.menuName,
        code: this.form.menuCode,
        description: null,
        sortNo: this.form.sortNo,
        isLeaf: this.form.isLeaf,
        treeLevel: null,
        seq: null,
        parentId: this.form.parentMenu.id,
        tenantId: this.currentApp.tenantId,
        menuIcon: this.form.icon,
        isFixed: null,
        openType: null,
        resource: {
        },
        isNewWindowOpen: this.form.isNewWindowOpen,
        funcname: null,
        menuType: this.form.mark === 'mobile' ? 'mobile' : (this.form.menuType === 'app' ? 'pc' : null),
        appId: this.form.menuType === 'app' ? this.currentApp.id : null,
      }
      const res = await this.dispatch(MenuController.createMenuWithLowForm, {
        resource:this.resourse,
        menu,
        roles:this.selectRoles,
      })
      if(!res.error){
        this.$message({
          message: '发布菜单成功！',
          type: 'success'
        });
        this.handleClose()
      }
    },
    handleClose(){
      this.$emit('update:dialogVisible',false)
    }
  },
}
</script>
<style lang="scss" scoped>
.new-form .el-form-item--mini.el-form-item {
  margin-bottom: 0;
}

::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0px 3px;
}

::v-deep .el-select .el-input .el-select__caret {
  height: 28px !important;
  line-height: 28px !important;
}
</style>
