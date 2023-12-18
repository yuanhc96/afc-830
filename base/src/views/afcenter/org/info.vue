<template>
  <div id="org-info">
    <el-form
      :ref="formRef"
      style="max-width:600px;"
      label-width="100px"
      :model="form"
      :rules="validateRules"
      :disabled="enableOpt"
    >
      <el-row v-if="form.type==='root'">
        <el-col :span="24">
          <div class="divide-bar"><span>基础信息</span></div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司名称" prop="orgName">
            <el-input v-model="form.orgName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else :gutter="20">
        <el-col
          :span="24"
        ><div class="divide-bar"><span>基础信息</span></div></el-col>
        <el-col
          :span="24"
        ><el-form-item label="名称" prop="name">
          <el-input v-model="form.name" /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="编号" prop="code">
          <el-input
            v-model="form.code"
            :disabled="formType === 'edit'"
          /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="等级" prop="orgLevel">
          <el-input v-model="form.orgLevel" :disabled="true" /> </el-form-item></el-col>
        <!-- <el-col  :span="24"
          ><el-form-item label="机构状态" prop="status">
            <el-select
              v-model="form.status"
              @change="changHandler"
              placeholder=""
            >
              <el-option
                v-for="(item, index) in statusOpts"
                :value="item.value"
                :label="item.label"
                :key="index"
              ></el-option>
            </el-select> </el-form-item
        ></el-col> -->
        <el-col :span="24">
          <el-form-item label="类型">
            <Dict
              v-model="form.types"
              style="width: 203px"
              dicttypeid="sys_org_type"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
        ><div class="divide-bar"><span>负责人信息</span></div></el-col>
        <el-col :span="24">
          <el-form-item label="分管领导" prop="chargerId">
            <SearchRemoteButton class="w-100p" :options="chargerOpts" :value.sync="form.chargerId" placeholder="输入人员名称搜索" @remoteMethod="remoteUser" @openDetail="openCharger({ id: 'mangerId', name: 'mangerName' })" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="负责人" prop="managerId">
            <SearchRemoteButton class="w-100p" :options="managerOpts" :value.sync="form.managerId" placeholder="输入人员名称搜索" @remoteMethod="remoteUser" @openDetail="openManager({ id: 'chargerId', name: 'chargerId' })" />
          </el-form-item>
        </el-col>

        <el-col
          :span="24"
        ><div class="divide-bar"><span>其他信息</span></div></el-col>

        <el-col
          :span="24"
        ><el-form-item label="地址" prop="address">
          <el-input v-model="form.address" /> </el-form-item></el-col>
        <el-col
          :span="24"
        ><el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
          /> </el-form-item></el-col>
        <el-col
          v-if="
            (dimensionData ? dimensionData.code !== 'def_dimension' : false) &&
              mainFlag
          "
          :span="24"
        >
          <el-form-item label="引用主维度">
            <SearchRemoteButton :options="options" :value.sync="form.mainDimensionOrgId" style="width:500px" placeholder="输入机构名称搜索" @remoteMethod="remoteMethod" @openDetail="openParty('ref')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="div-near-bottom">
      <el-button
        v-permission="FuncCode.afc_f_org_edit"
        type="primary"
        @click="submit"
      >保存</el-button>
    </div>
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
import { OrgController, TenantController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import { mapGetters } from 'vuex'
import model from './model'
import orgTree from './orgTree'
export default {
  name: '',
  components: { orgTree },
  mixins: [BaseVue, Form],
  props: {
    dimensionData: {},
    orgData: {},
  },
  data() {
    return {
      actionType: '',
      dicttypeid: 'sys_party_types',
      partyVisible: false,
      objectType: [],
      type: '',
      // 机构负责人
      managerOpts: [],
      // 机构分管领导
      chargerOpts: [],
      charger: { employee: { id: '', name: '', org: { id: '', name: '' }}},
      manager: { employee: { id: '', name: '', org: { id: '', name: '' }}},
      orgVisible: false,
      mainFlag: false,
      options: [],
      managerDialogVisible: false,
      chargerDialogVisible: false,
      marOptions: [],
      charOptions: [],
      statusOpts: [
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' },
      ],
      formRef: 'groupform',
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        code: [
          { required: true, message: '请输入机构编号', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入机构名称', trigger: 'change' },
          { message: '机构名称长度不超过64', max: 64 }
        ],
        orgName: [
          { required: true, message: '请输入公司名称', trigger: 'change' },
          { message: '公司名称长度不超过64', max: 64 }
        ]
      },
    }
  },
  watch: {
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
      },
    },
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
    formType(value) {
      if (value === 'add') this.form = _.clone(model)
    },
    form: {
      immediate: true,
      deep: true,
      handler(value, old) {
        if (value.mainDimensionOrgId && value.mainDimensionOrgId !== '') {
          this.mainFlag = true
          // this.getOrgById(value.mainDimensionOrgId);
          this.options = [
            { id: value.mainDimensionOrgId, name: value.mainDimensionOrgName },
          ]
        } else {
          this.mainFlag = false
        }
        // 选项置空
        if (old && value.id !== old.id) {
          this.managerOpts = []
          this.chargerOpts = []
        }
        value.managerId &&
          (this.managerOpts = [
            { id: value.managerId, name: value.managerName },
          ])
        value.chargerId &&
          (this.chargerOpts = [
            { id: value.chargerId, name: value.chargerName },
          ])
      },
    },
    managerDialogVisible(value) {
      if (!value) {
        this.manager = { employee: { id: '', name: '' }, org: {}}
      }
    },
    chargerDialogVisible(value) {
      if (!value) {
        this.charger = { employee: { id: '', name: '' }, org: {}}
      }
    },
  },
  computed: {
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
    // 判断主维度
    enableOpt() {
      if (
        this.dimensionData &&
        this.dimensionData.id !== this.form.dimensionId
      ) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['dicts']),
  },
  created() {},
  methods: {
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
      if ((this.actionType = 'ref')) {
        if (arr.length > 0) {
          const { id, name } = arr.pop()
          this.form.mainDimensionOrgId = id
          this.form.mainDimensionOrgName = name
          this.options = [{ id, name }]
        }
      } else {
        if (arr.length > 0) {
          this.form.parentId = arr.pop().id
        }
      }
    },

    // 处理机构负责人
    handleManager(selected) {
      this.form.managerId = selected.employee.id
      this.form.managerName = selected.employee.name
      this.manager.employee.id = selected.employee.id
      this.manager.employee.name = selected.employee.name
      this.managerOpts = [selected.employee]
    },
    // 处理机构分管领导
    handleCharger(selected) {
      this.form.chargerId = selected.employee.id
      this.form.chargerName = selected.employee.name
      this.charger.employee.id = selected.employee.id
      this.charger.employee.name = selected.employee.name
      this.chargerOpts = [selected.employee]
    },
    openCharger(prop) {
      this.formProp = prop
      this.chargerDialogVisible = true
    },
    openManager(prop) {
      this.formProp = prop
      this.managerDialogVisible = true
    },
    async changHandler(value) {
      let api
      if (value === '1') {
        api = OrgController.disableOrg
      } else {
        api = OrgController.enableOrg
      }
      const resp = await this.dispatch(api, { orgId: this.orgData.id })
      if (!resp.error) {
        this.$msg.success('修改成功!')
      }
    },
    async queryChildren() {
      const query = {
        pageIndex: 0,
        pageSize: 10,
        dimensionId: this.dimensionData.id,
        parentId: this.formData.id,
      }
      const resp = await this.dispatch(
        OrgController.queryChildOrgsWithPage,
        query
      )
      return resp
    },
    async maskClick() {
      if (!this.mainFlag) {
        const resp = await this.queryChildren()
        if (!resp.error) {
          if (resp.data.data.length === 0) this.mainFlag = true
          else this.$msg.warning('存在下级机构不允许引用机构！')
        }
      } else {
        this.mainFlag = !this.mainFlag
      }
    },
    async getOrgById(id) {
      const resp = await this.dispatch(OrgController.getOrgById, { id })
      if (!resp.error) {
        const { id, name } = resp.data
        this.options = [{ id, name }]
      }
    },
    hidden(type) {
      // 调用组织人员修改方法
      if (type !== 'cancel') {
        const resp = this.$refs.orgTree.getNodeData()
        this.form.mainDimensionOrgId = resp.id
        this.options.push(resp)
      }
      this.orgVisible = false
    },
    async validateResolve() {
      let resp = {}
      console.log(this.formType, 'this.formType')
      if (this.formType === 'add') {
        if (this.orgData) {
          this.form.parentCode = this.orgData.code
          this.form.orgLevel = parseInt(this.orgData.orgLevel) + 1
        }
        resp = await this.dispatch(OrgController.create, {
          required: true,
          org: {
            ...this.form,
            dimensionId: this.dimensionData.id,
          },
        })
        this.cancel()
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
          resp = await this.dispatch(OrgController.update, {
            required: true,
            org: {
              ...this.form,
            },
          })
        }
      }
      if (!resp.error) {
        let children
        if (this.mainFlag) {
          const resp = await this.queryChildren()
          if (!resp.error) {
            children = resp.data.data
          }
        }
        this.$msg.success('保存成功!')
        this.$emit('success', {
          ...this.form,
          name: this.form.orgName || this.form.name
        }, this.formType)
      }
    },
    // 远程搜索
    async remoteMethod(param) {
      const query = {
        pageIndex: 0,
        pageSize: 10,
        dimensionId: this.dimensionData.id,
        parentId: null,
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
    openTree() {
      this.orgVisible = true
    },
  },
}
</script>
<style lang="scss" scoped>
.org-type {
  width: 203px !important;
}
#org-info {
  height: calc(100vh - 120px);
  margin-bottom:20px;
  overflow-y: scroll;
  .memeber-comp {
    width: calc(100% - 18px);
  }
}
.mask {
  position: absolute;
  width: 50px;
  height: 20px;
  top: 0px;
  left: 80px;
  z-index: 2;
  cursor: pointer;
}

.el-row {
  margin-bottom: 14px;
}
</style>
