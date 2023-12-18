<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"
      label-width="150px"
    >
      <el-row>
        <el-col v-for="item in columns" :key="item.label" :span="24">
          <el-form-item :label="item.label" :prop="item.value">
            <el-input
              v-if="item.type === 'textarea'"
              v-model.trim="form[item.value]"
              type="textarea"
              :rows="6"
            />
            <el-select
              v-else-if="item.options"
              id="select"
              v-model="form[item.value]"
              style="width: 100%"
              :popper-append-to-body="false"
              placeholder="请选择"
              :disabled="formType === 'edit'"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-else v-model.trim="form[item.value]" :disabled="item.disabled && !!form[item.value]" />

            <!--  -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  RdcloudTemplateController
} from '@controller'
import { BaseVue, Form } from '@lib'
import { COLUMNS } from './constant'
export default {
  name: 'detail',
  mixins: [BaseVue, Form],
  props: {
    data: {
      default: () => {},
    },
  },
  data() {
    return {
      formRef: 'form',
      columns: COLUMNS,
      form: {
        id: null,
        content: null,
        description: '',
        code: null,
        extend: '',
        name: '',
        templateType: '',
      },
      validateRules: {
        content: [
          {
            required: true,
            message: '请输入模板内容',
            trigger: 'change',
          },
        ],
        code: [
          {
            required: true,
            message: '编码',
            trigger: 'change',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'change',
          },
        ],
      },
    }
  },
  computed: {
    formType() {
      console.log(this.form, this.form && !this.form.id, '=====form')
      if (this.form && !this.form.id) {
        return 'add'
      } else {
        return 'edit'
      }
    },
  },
  created() {
    // this.loadDicts()
  },
  methods: {
    submit() {
      this.$refs[this.formRef].validate(async(valid) => {
        if (valid) {
          this.validateResolve()
        } else {
        }
      })
    },
    async validateResolve() {
      this.$emit('update:loading', true)
      if (this.formType === 'add') {
        const resp = await this.dispatch(
          RdcloudTemplateController.create,
          { rdcloudTemplate: this.form }
        )
        console.log('resp:', resp)
        this.$emit('update:loading', false)
        this.$emit('success')
        // await this.$refs['upload'].submit()
      } else {
        const resp = await this.dispatch(
          RdcloudTemplateController.update,
          { rdcloudTemplate: this.form }
        )
        this.$emit('update:loading', false)
        if (!resp.error) {
          this.$msg.success('修改成功!')
          this.$emit('success')
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
