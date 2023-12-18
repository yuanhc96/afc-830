<template>
  <div>
    <template v-if="isEdit">
      <el-select v-if="compType === 'select'" v-model="value" on-bind="$attrs" v-bind="$attrs" @change="changeValue">
        <el-option v-for="dict in dicts" :key="dict.value" :value="dict[valueField]" :label="dict[labelField]" />
      </el-select>
      <template v-else-if="compType === 'checkbox'">
        <el-checkbox-group v-model="value" :disabled="disabled" @change="changeValue">
          <el-checkbox v-for="dict in dicts" :key="dict[valueField]" :label="dict[valueField]" :true-label="dict[valueField]" :false-label="null">
            {{ dict[labelField] }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="compType === 'radio'">
        <el-radio-group v-model="value" :disabled="disabled">
          <el-radio v-for="dict in dicts" :key="dict[valueField]" :label="dict[valueField]"> {{ dict[labelField] }} </el-radio>
        </el-radio-group>
      </template>
    </template>
    <template v-else>
      <span>{{ text }}</span>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { BaseVue, Dict } from '@lib'

export default {
  name: 'select-dict',
  components: {},
  mixins: [BaseVue],
  props: {
    style: {
      type: String,
      default: 'width:80%',
    },
    compType: {
      type: String,
      default: 'select',
    },
    defaultValue: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    valueField: {
      type: String,
      default: 'value',
    },
    labelField: {
      type: String,
      default: 'label',
    },
    dicts: {
      type: String,
      default: [],
    },
  },

  data() {
    return {
    }
  },
  computed: {
    text() {
      if (this.dicts.length > 0) {
        return _.get(this.dicts.find(d => d[this.valueField] === this.value), `[${this.labelField}]`, '')
      } else return ''
    },
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    getSelected() {
      return this.list.filter(l => {
        return l[this.valueField] === this.value
      })
    },

    changeValue(val) {
      this.$emit('input', val)
      this.$emit('change', val, this.defId)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
