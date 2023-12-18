<template>
  <div>
    <div v-for="(url, index) in urlList">
      <el-input
        v-model="urlList[index].value"
        :class="{'error-input':urlList[index].error}"
        clearable
        :disabled="!editable"
        style="width:300px;"
        class="mb-5"
        @change="valueChanged"
      />
      <el-button
        v-if="index > 0 && editable"
        icon="el-icon-delete"
        type="default"
        @click="removeRow(index)"
      />
      <transition enter-active-class="animated flipInX">
        <span v-if="errors[url.value]">
          <i v-if="errors[url.value].correct" class="el-icon-success success" />
          <i v-if="!errors[url.value].correct" class="el-icon-error error" />
          {{ errors[url.value].correct ? '通过' : '未通过' }}
        </span>
      </transition>
    </div>
    <el-button v-if="editable" icon="el-icon-plus" type="warning" @click="addRow" />
    <span v-if="editable" class="error-text">
      {{ errorInfo }}
    </span>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'url',
  props: {
    value: {},
    errors: {
      default: {},
    },
    editable: {
      default: true,
    },
    validator: {},
    label: {
      default: '地址'
    },
  },
  data() {
    return {
      urlList: [], errorInfo: ''
    }
  },
  computed: {},
  mounted() {
    this.valueChanged = _.debounce(() => {
      this.validate()
    }, 100)
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.urlList = val.split(',').map(v => {
            return {
              value: v,
              error: false,
            }
          })
        } else {
          this.urlList = [{ value: '', error: false }]
        }
      },
    },
    urlList: {
      deep: true,
      handler: _.throttle(function(val) {
        this.validate()
        this.$emit('input', val.map(v => v.value.replace(/,/gi, '').trim()).join(','))
      }, 300)
    },
  },
  methods: {
    validate() {
      this.errorInfo = ''
      if (this.validator) {
        this.urlList.forEach(item => {
          let valid = this.validator
          if (!_.isArray(this.validator)) {
            valid = [this.validator]
          }
          valid.forEach(v => {
            v.call(this, null, item.value, (error) => {
              if (error && error.message) {
                this.errorInfo = `${this.label}${error.message}`
                item.error = true
              }
            })
          })
        })
      }
      return !this.errorInfo
    },
    addRow() {
      this.urlList.push({ value: '', error: false })
    },
    removeRow(index) {
      this.urlList.splice(index, 1)
    },
  },
}
</script>
