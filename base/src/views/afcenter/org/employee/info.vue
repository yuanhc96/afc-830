<template>
  <div class="m-10">
    <el-form
      :ref="formRef"
      :model="form"
      label-position="top"
      :disabled="disabled"
    >
      <el-row :gutter="22">
        <el-col :span="24"><div class="divide-bar"><span>个人信息</span></div></el-col>
        <el-col
          :span="12"
        ><el-form-item label="性别" prop="gender">
          <Dict
            v-model="form.gender"
            dicttypeid="gender"
          /> </el-form-item></el-col>

        <el-col :span="12">
          <el-form-item label="电话" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" /> </el-form-item></el-col>

        <el-col
          :span="12"
        ><el-form-item label="邮件" prop="pemail">
          <el-input v-model="form.pEmail" /> </el-form-item></el-col>

        <el-col
          :span="12"
        ><el-form-item label="证件类型" prop="cardType">
          <Dict v-model="form.cardType" dicttypeid="sys_card_type" />
        </el-form-item></el-col>

        <el-col
          :span="12"
        ><el-form-item label="证件号码" prop="cardNumber">
          <el-input v-model="form.cardNumber" /> </el-form-item></el-col>
        <el-col :span="24"><div class="divide-bar"><span>其他</span></div></el-col>
        <el-col
          :span="12"
        ><el-form-item label="排序" prop="sortBy">
          <el-input
            v-model="form.sortBy"
            :min="1"
            type="number"
          /> </el-form-item></el-col>

        <el-col
          :span="24"
        ><el-form-item label="备注" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
          /> </el-form-item></el-col>
      </el-row>
    </el-form>
    <!-- <div class="save-button">
      <el-button :loading="btnLoading" type="primary" @click="submit">保存</el-button>
    </div> -->
  </div>
</template>
<script>
import { EmployeeController, OrgController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
import model from './model'
export default {
  name: '',
  components: {},
  mixins: [BaseVue, Form],
  props: {
    dimensionData: {},
    orgData: {},
    userId: '',
    disabled: {
      default: false
    }
  },
  data() {
    return {
      formRef: 'groupform',
      form: _.cloneDeep(model),
      model: model,
      validateRules: {
        code: [
          { required: true, message: '请输入应用代码', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ EmployeeController,OrgController])
      .state(),
    btnLoading() {
      return this.EmployeeController.update.loading
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
  },
  watch: {
    formType(value) {
      if (value === 'add') this.form = _.clone(model)
    },
  },
  mounted() {},
  methods: {
    async validateResolve() {
      let resp = {}
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
        const body = { ...this.form }
        delete body.employee
        resp = await this.dispatch(EmployeeController.update, {
          required: true,
          employee: {
            ...body,
          },
        })
      }
      if (!resp.error) {
        this.$msg.success('保存成功!')
        const body = { ...this.form }
        delete body.employee
        this.$emit('update:formData', body)
        this.$emit('success')
        return true
      } else {
        return false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  ::v-deep .fold-group{
    max-height: 500px;
    overflow-x: hidden;
  }
  .save-button{
    float: right
  }
</style>
