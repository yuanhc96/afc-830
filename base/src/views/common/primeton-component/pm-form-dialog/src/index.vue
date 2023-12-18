<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" v-bind="$attrs" :close-on-click-modal="false">
    <slot name="form" />
    <div slot="footer">
      <el-button type="text" @click="cancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="submit">{{ okText }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {},
    okText: {
      default: '提交'
    },
    cancelText: {
      default: '取消'
    },
    title: {},
    formType: {
      default: 'form'
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.cancel()
      }
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false)
      if (this.getForm() && this.getForm().cancel) {
        this.getForm().cancel()
      }
    },
    getForm() {
      return this.$slots['form'][0]['componentInstance']
    },
    async submit() {
      if (this.formType === 'form') {
        const comp = this.getForm()
        if (comp.$refs[comp.formRef]) {
          comp.$refs[comp.formRef].validate(async valid => {
            if (valid) {
              if (comp.validateResolve) {
                if (comp.validateResolve.call(comp, null)) {
                  this.cancel()
                }
              }
            } else {
              comp.validateReject && comp.validateReject.call(comp, null)
            }
          })
        }
      } else {
        const comp = this.getForm()
        if (comp.callback()) {
          this.cancel()
        }
      }
    }
  }
}
</script>
