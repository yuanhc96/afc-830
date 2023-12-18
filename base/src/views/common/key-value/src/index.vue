<template>
  <div>
    <el-row v-for="(item, index) in list" :key="index" class="mb-5">
      <el-col :span="9">
        <el-input
          v-model="list[index].key"
          :class="{'error-input':item.error.k}"
          :maxlength="keyMaxlength"
          :placeholder="keyLabel"
          @keyup.native="valueChanged"
          @change="valueChanged"
        />
      </el-col>
      <el-col :span="1" class="text-center">=</el-col>
      <el-col :span="9">
        <el-input
          v-model="list[index].value"
          :class="{'error-input':item.error.v}"
          :maxlength="valueMaxlength"
          :placeholder="valueLabel"
          @keyup.native="valueChanged"
          @change="valueChanged"
        />
      </el-col>
      <el-col :span="4" class="pl-5">
        <el-button v-if="index !== 0" icon="el-icon-delete" @click="removeRow(index)" />
      </el-col>
    </el-row>
    <el-button icon="el-icon-plus" type="warning" @click="addRow" />
    <span class="error-text">{{ errors }}</span>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'key-value',
  props: {
    keyLabel: {
      default: '参数名'
    },
    valueLabel: {
      default: '参数值'
    },
    value: {},
    validator: {},
    keyMaxLength: {
      default: 100,
    },
    valueMaxLength: {
      default: 100,
    },
  },
  data() {
    return {
      list: [],
      errors: '',
      keyMaxlength: 14,
      valueMaxlength: 50
    }
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.list = [{ key: '', value: '', error: {}}]
        } else {
          this.list = val.split(',').map(item => {
            const arr = item.split('=')
            return {
              key: arr[0],
              value: arr[1],
              error: { k: item.error ? item.error.k : false, v: item.error ? item.error.v : false },
            }
          })
          this.validate()
        }
      },
    },
  },
  mounted() {
    this.valueChanged = _.debounce(() => {
      const value = this.list
        .filter(l => !!l.key && !!l.value)
        .map(l => `${l.key}=${l.value}`)
        .join(',')
      this.$emit('input', value)
      this.validate()
    }, 100)
  },
  methods: {
    validate() {
      this.errors = ''
      if (this.validator) {
        if (this.validator.key) {
          this.list.forEach(item => {
            this.validator.key(null, item.key, (error) => {
              if (error) {
                this.errors = `${this.keyLabel}只能包含${error.message}`
                item.error.k = true
              }
            })
          })
        }
        if (this.validator.value) {
          this.list.forEach(item => {
            this.validator.value(null, item.value, (error) => {
              if (error) {
                this.errors = `${this.valueLabel}只能包含${error.message}`
                item.error.v = true
              }
            })
          })
        }
      }
      return !this.errors
    },
    addRow() {
      const list = _.cloneDeep(this.list)
      list.push({ key: '', value: '', error: { k: false, v: false }})
      this.list = list
    },
    removeRow(index) {
      const list = _.cloneDeep(this.list)
      list.splice(index, 1)
      this.list = list
    },
  },
}
</script>
