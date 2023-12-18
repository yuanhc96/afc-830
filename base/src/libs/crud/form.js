import { cloneDeep } from 'lodash'
export default {
  props: {
    formData: {},
    showFooter: { default: false },
    readonly: { default: false },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    formData: {
      immediate: true,
      handler: function(val, oval) {
        if (val) {
          this.form = {
            ...this.model,
            ...cloneDeep(val),
          }
          if (this.afterFormChanged) {
            this.afterFormChanged.call(this)
          }
          this.clearValidate()
        }
      },
    },
    dialogVisible(val) {
      if (!val) {
        this.cancel()
      }
    },
  },
  data() {
    return {
      formRef: 'form',
      form: null,
    }
  },
  methods: {
    clearValidate() {
      this.$nextTick(() => {
        this.$refs[this.formRef] && this.$refs[this.formRef].clearValidate()
      })
    },
    resetFields() {
      this.$nextTick(() => {
        this.$refs[this.formRef] && this.$refs[this.formRef].resetFields()
      })
    },
    cancel() {
      this.$emit('update:formData', null)
      this.$emit('update:dialogVisible', false)
      if (this.afterCancel) {
        this.afterCancel.call(this)
      }
      setTimeout(() => {
        this.form = cloneDeep(this.model || {})
        this.clearValidate()
      }, 300)
    },
    async submit(args) {
      return await this.$refs[this.formRef].validate(async valid => {
        if (valid) {
          this.validateResolve && this.validateResolve.call(this, args)
        } else {
          this.validateReject && this.validateReject.call(this, args)
        }
      })
    },
  },
}
