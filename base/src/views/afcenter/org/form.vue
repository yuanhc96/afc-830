<template>
  <div>
    <el-form
      :ref="formRef"
      label-width="130px"
      class="position-form"
      :model="form"
      :rules="validateRules"
      :disabled="disabled"
      data-testId="组织机构表单"
      label-position="top"
    >
      <el-row v-if="form.type==='root'">
        <el-col :span="24">
          <el-form-item label="公司名称" prop="orgName">
            <el-input v-model="form.orgName" />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-else>
        <el-row :key="formType" :gutter="20">
          <el-col
            :span="12"
          ><el-form-item label="上级机构">
            <SearchRemoteButton class="w-100p" :disabled="true" :value.sync="form.parentId" :options="items" placeholder="输入机构名称搜索" @openDetail="openParty" />
          </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <Dict v-model="form.types" class="w-100p" dicttypeid="sys_org_type" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col
            :span="12"
          ><el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" v-focus="formType ==='edit'" /> </el-form-item></el-col>
            <el-col
            :span="12"
          ><el-form-item label="编号" prop="code">
            <el-input v-model.trim="form.code" v-focus="formType!=='edit'" :disabled="formType==='edit'" /> </el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col
            :span="12"
          >
            <el-form-item label="负责人" prop="managerId">
              <SearchRemoteButton class="w-100p" :value.sync="form.managerId" placeholder="输入人员名称搜索" :options.sync="managerOpts" @remoteMethod="remoteUser" @openDetail="openManager({ id: 'chargerId', name: 'chargerId' })" />
            </el-form-item></el-col>

          <el-col
            :span="12"
          ><el-form-item label="分管领导" prop="chargerId">
            <SearchRemoteButton class="w-100p" :value.sync="form.chargerId" :options.sync="chargerOpts" placeholder="输入人员名称搜索" @openDetail="openCharger({ id: 'mangerId', name: 'mangerName' })" @remoteMethod="remoteUser" /></el-form-item>
          </el-col>
          <el-col
            :span="12"
          ><el-form-item label="地址" prop="address">
            <el-input v-model.trim="form.address" /> </el-form-item></el-col>
          <el-col
            :span="12"
          ><el-form-item label="联系人" prop="linkman">
            <el-input v-model.trim="form.linkman" /> </el-form-item></el-col>
          <el-col
            :span="12"
          ><el-form-item label="联系电话" prop="phone">
            <el-input v-model.trim="form.phone" /> </el-form-item></el-col>
          <el-col
            :span="12"
          ><el-form-item label="排序" prop="sortBy">
            <el-input v-model="form.sortBy" type="number" :min="0" /> </el-form-item></el-col>
          <el-col
            :span="24"
          ><el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
            /> </el-form-item></el-col>
          <el-col v-if="dimensionData.code !== 'def_dimension'" :span="12">
            <el-form-item label="引用主维度机构">
              <el-switch v-model="mainFlag" />
            </el-form-item>
          </el-col>
          <el-col v-if="mainFlag" :span="12">
            <el-form-item label="主维度机构">
              <el-select
                v-model="form.mainDimensionOrgId"
                remote
                :remote-method="remoteMethod"
                value-key=""
                placeholder="输入机构名称搜索"
                clearable
                filterable
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-link
                icon="el-icon-search"
                :underline="false"
                @click="openParty('ref')"
              />
            </el-form-item>

          </el-col>
        </el-row>
      </template>

    </el-form>
    <SelectUser
      v-model="manager"
      :dialog-visible.sync="managerDialogVisible"
      @input="handleManager"
    />
    <SelectUser
      v-model="charger"
      :dialog-visible.sync="chargerDialogVisible"
      @input="handleCharger"
    />
    <!-- <pm-dialog class="org-tree" :visible.sync="orgVisible" title="主维度机构" width="960px">
      <orgTree ref="orgTree" :dimensionData="dimensionData"></orgTree>
      <div slot="footer">
        <el-button @click="hidden('cancel')" size="mini">关闭</el-button>
        <el-button @click="hidden" size="mini" type="primary">确定</el-button>
      </div>
    </pm-dialog> -->
    <SelectTypes
      :active-name="type"
      :dialog-visible.sync="partyVisible"
      title="选择组织机构"
      :party-types="objectType"
      @sure="handleSuccess"
    />
  </div>
</template>

<script>
import { EmployeeController, OrgController, TenantController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
import { mapGetters } from 'vuex'
import model from './model'
import orgTree from './orgTree'
export default {
  name: '',
  inject: ['parentRef'],
  components: { orgTree },
  mixins: [BaseVue, Form],
  props: {
    dimensionData: {},
    orgData: {},
    loading: {
      default: false
    },
    disabled: {
      default: function() {
        return false
      }
    },
  },
  data() {
    let codeTimer = null
    const _this = this
    function validater(rule, value, callback, source, options) {
      let api
      if (rule.field === 'code') {
        api = OrgController.findOrgIsExist
      } else {
        api = OrgController.findOrgIsExist
      }

      if (codeTimer !== null) {
        clearTimeout(codeTimer)
      }
      codeTimer = setTimeout(async() => {
        if (!value || _this.formType == 'edit') {
          callback()
        } else {
          const count = await _this.dispatch(api, { code: value })
          if (count.data) {
            callback(new Error(`${value}机构编号已存在!`))
          }
          callback()
        }
      }, 300)
    }
    return {
      tree: this.parentRef.tree,
      items: [],
      actionType: '',
      dicttypeid: 'sys_party_types',
      partyVisible: false,
      objectType: [],
      type: '',
      statusOptions: [
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' },
      ],
      formProp: 'chargerId',
      managerDialogVisible: false,
      chargerDialogVisible: false,
      orgVisible: false,
      mainFlag: false,
      options: [],
      marOptions: [],
      charOptions: [],
      formRef: 'groupform',
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        code: [
          { required: true, message: '请输入机构编号', trigger: 'change' },
          { validator: validater },
        ],
        name: [
          { required: true, message: '请输入机构名称', trigger: 'change' },
          { message: '机构名称长度不超过64', max: 64 }
        ],
      },
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler: function(value) {
        if (value) {
          let name
          let id
          if (this.formType === 'edit' && (!this.orgData || !this.form.parentId)) {
            name = ''
            id = this.form.parentId
          } else {
            name = this.orgData ? `${this.orgData.name}(${this.orgData.code})` : ''
            id = this.orgData ? this.orgData.id : null
            this.$nextTick(() => {
              this.form.parentId = id
            })
          }
          this.items = [{ id, name }]
        }
      }
    },
    btnLoading(value) {
      this.$emit('update:loading', value)
    },
    dicts: {
      immediate: true,
      handler(val) {
        if (val) {
          const objectType = this.dicts[this.dicttypeid] || []
          this.objectType = objectType.filter((item) => {
            if (item.code == 'org') {
              return item
            }
          })
          if (this.objectType.length > 0) {
            const dictType = {}
            this.objectType.forEach((item) => {
              dictType[item.code] = item.name
            })
            this.dictType = dictType
            this.type = this.objectType[0].code
          }
        }
      } },
    type: {
      immediate: true,
      handler(val) {
        if (val) {
          this.typeObject = this.objectType.filter((item) => {
            if (item.code == val) {
              return [item]
            }
          })
        }
      },
    },
    formType: {
      immediate: true,
      handler: function(value) {
        if (value === 'add') this.form = _.clone(model)
      },
    },
    mainFlag(value) {
      if (!value) {
        this.form.mainDimensionOrgId = ''
      }
    },
    orgVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.orgTree && this.$refs.orgTree.refreshTree()
        })
      }
    },
    form: {
      immediate: true,
      handler: function(value) {
        if (value.mainDimensionOrgId) {
          this.mainFlag = true
          this.options = [{ id: value.mainDimensionOrgId, name: value.mainDimensionOrgName }]
        } else {
          this.mainFlag = false
          this.options = []
        }
      }
    },
  },
  computed: {
    ...VueUtil(this)
      .select([EmployeeController, OrgController])
      .state(),
    btnLoading() {
      return this.OrgController.update.loading || this.OrgController.create.loading
    },
    parentVisible() {
      // if(!this.formData){
      //   return false
      // }else if(this.formData.code === this.orgData?.code){
      //   return false
      // }else{
      //   return true
      // }
      if (this.formType === 'edit') {
        return this.orgData && this.form.parentId
      } else if (this.formType === 'add') {
        return this.orgData
      }
    },
    ...mapGetters(['dicts']),
    parentName() {
      if (this.formType === 'edit' && (!this.orgData || !this.form.parentId)) {
        return ''
      }
      return `${this.orgData.name}(${this.orgData.code})`
    },
    title() {
      return `${this.formType === 'add' ? '新建' : '编辑'}组织维度`
    },
    formType() {
      if (this.formData) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    managerOpts() {
      if (this.options.length > 0) {
        return this.options
      } else if (this.formData) {
        const employee = {
          id: this.formData.managerId,
          name: this.formData.managerName,
        }
        return [employee]
      } else {
        const employee = {
          id: this.form.managerId,
          name: this.form.managerName,
        }
        if (this.form.managerId) {
          return [employee]
        } else { return [] }
      }
    },
    chargerOpts() {
      if (this.options.length > 0) {
        return this.options
      } else if (this.formData) {
        const employee = {
          id: this.formData.chargerId,
          name: this.formData.chargerName,
        }
        return [employee]
      } else {
        const employee = {
          id: this.form.chargerId,
          name: this.form.chargerName,
        }
        if (this.form.chargerId) {
          return [employee]
        } else {
          return []
        }
      }
    },
    charger() {
      if (this.formData) {
        const employee = {
          id: this.formData.chargerId,
          name: this.formData.chargerName,
        }
        return employee
      } else {
        const employee = {
          id: this.form.chargerId,
          name: this.form.chargerName,
        }
        return employee
      }
    },
    manager() {
      if (this.formData) {
        const employee = {
          id: this.formData.managerId,
          name: this.formData.managerName,
        }
        return employee
      } else {
        const employee = {
          id: this.form.managerId,
          name: this.form.managerName,
        }
        return employee
      }
    },
  },
  mounted() {
    this.loadDict()
  },
  methods: {
    afterCancel() {
      this.mainFlag = false
    },
    async loadDict() {
      if (!this.dicttypeid) {
        return
      }
      if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
        this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
        const resp = await this.dispatch(
          DictTypeController.queryDictTypesByCriteria,
          {
            code: this.dicttypeid,
            tenantId: this.currentTenant,
          }
        )
        if (!resp.error) {
          this.$store.commit('ADD_DICT', {
            key: this.dicttypeid,
            value: resp.data.data.length ? resp.data.data[0].dictEntrys : [],
          })
        }
      }
    },
    openParty(type) {
      this.actionType = type
      this.partyVisible = true
    },
    handleSuccess(arr) {
      if (arr.length > 0) {
        const { id, name } = arr.pop()
        if (this.actionType == 'ref') {
          this.form.mainDimensionOrgId = id
          this.form.mainDimensionOrgName = name
          this.options = [{ id, name }]
        } else {
          this.form.parentId = id
          this.items = [{ id, name }]
        }
      }
    },
    handleManager(selected) {
      this.form.managerId = selected.employee.id
      const prop = this.formData ? 'formData' : 'form'
      this[prop].managerId = selected.employee.id
      this[prop].managerName = selected.employee.name
    },
    handleCharger(selected) {
      this.form.chargerId = selected.employee.id
      this.form.chargerName = selected.employee.name
      const prop = this.formData ? 'formData' : 'form'
      this[prop].chargerId = selected.employee.id
      this[prop].chargerName = selected.employee.name
    },
    openCharger(prop) {
      this.formProp = prop
      this.chargerDialogVisible = true
    },
    openManager(prop) {
      this.formProp = prop
      this.managerDialogVisible = true
    },
    hidden(type) {
      // 调用组织人员修改方法
      if (type !== 'cancel') {
        const resp = this.$refs.orgTree.getNodeData()
        this.form.mainDimensionOrgId = resp.id
        this.options.push(resp)
      }
      // this.mainFlag = false;
      this.orgVisible = false
    },
    openTree() {
      this.orgVisible = true
    },
    // 远程搜索
    async remoteMethod(param) {
      const query = {
        pageIndex: 0,
        pageSize: 10,
        dimensionId: this.dimensionData.id,
        parentId: '0',
        name: param,
      }
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        query
      )
      if (!resp.error) {
        this.data = resp.data.data
      }
    },
    // 远程搜索
    async remoteUser(param) {
      const query = {
        pageIndex: 0,
        pageSize: 99,
        name: param,
      }
      const resp = await this.dispatch(
        EmployeeController.queryEmployeesByTenantId,
        query
      )
      if (!resp.error) {
        this.data = resp.data.data
      }
    },
    async validateResolve() {
      let resp = {}
      if (this.formType === 'add') {
        if (this.orgData && Object.keys(this.orgData).length > 0) {
          this.form.parentId = this.orgData.type === 'root' ? null : this.orgData.id
          this.form.orgLevel = parseInt(this.orgData.orgLevel) + 1
        }
        const paths = this.tree.getNodePath(this.tree.getCurrentNode())
        const fullCodePath = paths.reduce((pre, cur, idx) => {
          if (idx === 0) {

          } else {
            pre = pre + cur.id + '/'
          }
          return pre
        }, '/')
        this.form.fullCodePath = fullCodePath
        resp = await this.dispatch(OrgController.create, {
          required: true,
          org: {
            ...this.form,
            dimensionId: this.dimensionData.id,
          },
        })
      } else if (this.formType === 'edit') {
        if (this.form.type === 'root') {
          const form = {
            id: this.form.id.slice(7),
            orgName: this.form.orgName
          }
          resp = await this.dispatch(TenantController.update, {
            tenant: form
          })
        } else {
          if (this.form.parentId) {
            const parentNode = this.tree.getNode(this.form.parentId)
            const paths = this.tree.getNodePath(parentNode)
            const fullCodePath = paths.reduce((pre, cur, idx) => {
              if (idx === 0) {

              } else {
                pre = pre + cur.id + '/'
              }
              return pre
            }, '/')
            this.form.fullCodePath = fullCodePath
          }
          resp = await this.dispatch(OrgController.update, {
            required: true,
            org: {
              ...this.form,
            },
          })
        }
      }
      if (!resp.error) {
        this.$msg.success('保存成功!')
        let formData
        if (this.formType === 'add') {
          formData = { ...resp.data }
        } else {
          formData = { ...this.form, name: this.form.orgName || this.form.name }
        }
        this.$emit('success', formData, this.formType)
        this.cancel()
        return true
      } else {
        return false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.org-tree{
  min-height: 400px;
}
</style>
