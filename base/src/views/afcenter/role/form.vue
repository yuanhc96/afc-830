<template>
  <el-dialog width="480px" :visible.sync="dialogVisible" title="新建角色" append-to-body>
    <div>
      <el-form :ref="formRef" label-position="top" :model="form" :rules="validateRules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="form.code" v-focus @input="inputChange" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" v-focus />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description" type="textarea" :row="3" />
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { RoleController } from '@controller'
import { BaseVue, Form, _ } from '@lib'
import model from './model.js'
import Info from './tabs/info.vue'
export default {
  name: 'detail',
  components: { Info },
  mixins: [BaseVue, Form],
  props: {
    type: {
      type: String,
    },
    businessObjId: {
      type: String
    }
  },
  data() {
    let codeTimer = null
    return {
      model: model,
      form: _.cloneDeep(model),
      loading: false,
      validateRules: {
        code: [{ required: true, message: '请输入角色编号', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value || this.formType == 'edit') {
                callback()
              } else {
                const count = await this.dispatch(RoleController.existenceByCode, { code: value })
                if (count.data) {
                  callback(new Error(`${value}角色编号已存在`))
                }
                callback()
              }
            }, 300)
          } }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    async validateResolve() {
      this.loading = true
      const resp = await this.dispatch(RoleController.create, {
        role:
            {
              code: this.form.code,
              name: this.form.name,
              isFixed: '0',
              tenantId: this.currentTenant,
              description: this.form.description,
              types: this.type,
              businessObjId: this.businessObjId
            }
      })
      this.loading = false
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        this.cancel()
      }
    }
  },
}
</script>
