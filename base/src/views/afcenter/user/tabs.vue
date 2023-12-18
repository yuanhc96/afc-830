<comment>
// 弹窗tab组件
// items:[{label:"",name:"",slot:""}],activeName:""
</comment>
<template>
  <pm-dialog
    ref="dialog"
    :top="top"
    :append-to-body="true"
    :visible.sync="visible"
    :title="title"
    v-bind="$attrs"
    :close-on-click-modal="false"
    :show-footer="showFooter"
  >
    <div :class="bodyClass">
      <div :style="style">
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="(item,index) in items" :key="index" :label="item.label" :name="item.name" lazy>
            <slot :name="item.slot" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-if="showFooter" slot="footer">
      <template>
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button v-if="submitable" type="primary" :loading="loading" @click="submit">确定</el-button>
      </template>
    </div>
  </pm-dialog>
</template>
<script>
// import { getForms, validateForms } from '../../common/form.util.js'

export default {
  name: 'pm-tabs-dialog',
  mixins: [],
  props: {
    items: [],
    activeName: '',
    style: {
      type: Object,
      default() {
        return { 'min-height': '300px' }
      }
    },
    dialogVisible: {
      type: Boolean,
      default: true
    },
    okText: {
      type: String,
      default: null
    },
    cancelText: {
      type: String,
      default: null
    },
    submitable: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false,
    },
    bodyClass: {
      type: String,
      default: 'pl-20 pr-20'
    },
    formType: {
      type: String,
      default: 'form'
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.dialogVisible
    }
  },
  computed: {
    top() {
      return this.items.length && this.items[0].slot === 'form' ? undefined : '40px'
    }
  },
  watch: {
    dialogVisible(val) {
      this.visible = val
    },
    visible(val) {
      if (!val) {
        this.cancel()
        this.$refs.dialog.hidden()
      } else {
        this.$refs.dialog.show()
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false)
      this.$emit('update:formData', null)
      if (this.inline && this.$parent && this.$parent.cancel) {
        this.$parent.cancel()
      } else if (this.getRootForm && this.getRootForm() && this.getRootForm().cancel) {
        this.getRootForm().cancel()
      }
    },
    getRootForm() {
      try {
        return this.$slots['form'][0]['componentInstance']
      } catch (e) {
        return null
      }
    },
    async submit() {
      if (this.$listeners.submit) {
        this.$emit('submit')
      } else if (this.formType === 'form') {
        const comp = this.getRootForm()
        if (this.inline) { // form内联
          comp.validate(async valid => {
            if (valid) {
              if (this.$parent.validateResolve) {
                // eslint-disable-next-line no-useless-call
                if (await this.$parent.validateResolve.call(this.$parent, null)) {
                  this.cancel()
                }
              }
            } else {
              // eslint-disable-next-line no-useless-call
              this.$parent.validateReject && this.$parent.validateReject.call(this.$parent, null)
            }
          })
        } else { // form 组件化
          if (!comp) {
            this.$emit('update:dialogVisible', false)
            return
          }
          if (comp.$refs[comp.formRef]) {
            comp.$refs[comp.formRef].validate(async valid => {
              if (valid) {
                if (comp.validateResolve) {
                // eslint-disable-next-line no-useless-call
                  if (await comp.validateResolve.call(comp, null)) {
                    this.cancel()
                  }
                }
              } else {
              // eslint-disable-next-line no-useless-call
                comp.validateReject && comp.validateReject.call(comp, null)
              }
            })
          }
        }
      } else {
        const comp = this.$slots.form[0].componentInstance
        if (this.inline) {
          if (this.$parent.callback && (await this.$parent.callback())) {
            this.cancel()
          }
        } else {
          if (comp.callback && (await comp.callback())) {
            this.cancel()
          }
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
 ::v-deep .el-tabs__content{
   padding-top:0px;
 }
</style>
