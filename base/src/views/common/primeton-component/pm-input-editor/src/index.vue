<template>
  <div v-if="disabled" class="mt-5">{{ value }}</div>
  <div
    v-else
    v-loading="loading"
    element-loading-spinner="null"
    element-loading-background="rgba(255, 255, 255, 0.3)"
    class="input-editor-container"
    @click.stop="edit($event, false)"
  >
    <el-input
      :ref="`input-${fieldName}`"
      v-model="value"
      :style="inputStyle"
      :size="size"
      :disabled="ffDisabled"
      :type="type"
      :rows="rows"
      :placeholder="placeholder"
      @keypress.enter.native="save"
      @blur="blur"
    />
    <span :class="`btn-group btn-group-${position}`">
      <el-button-group>
        <el-button  v-if="!editFlag" :loading="loading" icon="el-icon-check" @click.stop="save()"/>
        <el-button  v-if="!editFlag" icon="el-icon-close" @click="edit($event, true)"/>
      </el-button-group>
    </span>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'input-editor',
    components: {},
    props: {
      size: {},
      position: {
        default: 'right'
      },
      fontSize: {
        default: '14px',
      },
      fieldName: {},
      disabled: {
        default: false,
      },
      type: {
        default: 'text',
      },
      rows: {
        default: 1,
      },
      saveField: {
        type: Function,
      },
      value: {
        type: String,
      },
      placeholder: {
        type: String,
      },
      valueFormat: {
        type: Function,
      },
      validator: {
        type: Function,
      },
      inputStyle: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        oldValue: null,
        loading: false,
        editFlag: true,
      }
    },
    computed: {
      ffDisabled() {
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          return false
        } else {
          return this.editFlag
        }
      },
    },
    mounted() {
      this.oldValue = this.value
    },
    methods: {
      async save() {
        if (this.oldValue === this.value || !this.saveField) {
          this.editFlag = true
          return
        }
        if (this.validateValue()) {
          this.loading = true
          const resp = await this.saveField(this.fieldName, this.valueFormat ? this.valueFormat(this.value) : this.value)
          if (!resp.error) {
            this.editFlag = true
            this.loading = false
            this.oldValue = this.value
            this.$emit('input', this.value)
          } else {
            this.loading = false
            this.$notify({
              message: '更新失败!',
              type: 'error',
            })
          }
        }
      },
      validateValue() {
        return this.validator ? this.validator(this.value) : true
      },
      blur() {
        if( this.value === this.oldValue){
          this.editFlag = true
        }
      },
      edit(e, f) {
        if (e) {
          e.stopImmediatePropagation && e.stopImmediatePropagation()
        }

        this.editFlag = f
        if (!f) {
          this.$nextTick(() => {
            const ref = this.$refs[`input-${this.fieldName}`]
            ref.focus()
          })
        } else {
          this.value = this.oldValue
          this.$emit('input', this.value)
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-button {
    padding: 3px 5px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 10px;
  }

  .el-input--suffix .el-input__inner {
    padding-right: 10px;
    transition: padding-right .3s ease;
  }

  ::v-deep .el-input.el-input--mini.is-disabled .el-input__inner, ::v-deep .el-input.el-input--small.is-disabled .el-input__inner {
    padding-left: 2px;
    padding-right: 2px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #e1e1e1;
    }
  }

  ::v-deep .el-input.el-input--mini .el-input__inner, ::v-deep .el-input.el-input--small .el-input__inner {
    padding-left: 2px;
    padding-right: 60px;
  }

  .input-editor-container {
    position: relative;
    .btn-group {
      line-height: 100%;
      position: absolute;
    }
    .btn-group-right {
      top: 3px;
      right: 4px;
    }
    .btn-group-bottom {
      top: 30px;
      right: 0px;
    }

    border: 1px solid transparent;
    border-radius: 4px;
    transition: border -5s ease;

    &:hover {
      .btn-group {
        display: block;
      }
    }
  }
</style>
