<template>
  <el-form
    ref="searchForm"
    class="view-form"
    label-width="90px"
    :inline="true"
    :model="query"
    @submit.native.prevent
  >
    <el-popover
      v-model="visible"
      placement="bottom-start"
      :width="containerWidth"
      trigger="manual"
      transition="none"
      :visible-arrow="false"
    >
      <div ref="container" class="position-relative">
        <el-button class="ml-10 position-absolute" style="right:0px;top:-10px;font-size:16px;" type="text" icon="el-icon-close" @click="close" />
        <el-form
          ref="searchForm"
          class="view-form"
          label-width="90px"
          label-position="top"
          :model="query"
          @submit.native.prevent
        >
          <template>
            <slot name="body" />
          </template>
          <el-form-item class="mt-10 text-right">
            <el-button icon="el-icon-search" plain type="primary" @click="seniorSearch">搜索</el-button>
            <el-button class="ml-10" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="reference">
        <el-input v-if="props.length === 0" v-model="query[defaultProp]" clearable :placeholder="$attrs.placeholder" @keypress.enter.native="search">
          <i slot="prefix" class="el-icon-user el-input__icon" @click="showSearchPophover" />
          <el-button slot="append" @click="showSearchPophover"><i class="iconfont icon-Customermanagement-fill" /></el-button>
        </el-input>
        <div v-else class="ellipsis" style="cursor:pointer;display:flex;text-align:left;padding:0px 10px;height:28px;width:100%;border:1px solid #e5e5e5;" @click.stop="showSearchPophover">
          <div style="width:20px;">
            <i class="el-icon-search" style="line-height:25px;color:gray;" />
          </div>
          <div style="flex:1;padding-top:2px;overflow:hidden;">
            <el-tag v-for="prop in props" :key="prop.code" :disable-transitions="true" class="mr-5 mt-2 ellipsis" style="max-width:200px;">
              <div style="display:flex">
                <div style="flex:1;max-width:180px;" class="ellipsis">{{ getPropTitle(prop) }}：{{ getValueText(prop) }}</div>
                <i class="ml-2 pt-2 el-icon-circle-close" @click.stop="removeProp(prop)" />
              </div>
            </el-tag>
          </div>
          <div style="width:30px;">
            <el-button style="background:#EAF0FF;margin-top:-1px;" icon="el-icon-circle-close" @click.stop="clear" />
          </div>
        </div>
      </div>
    </el-popover>
  </el-form>
</template>
<script>
import moment from 'dayjs'
import { isEqual, unionWith } from 'lodash'
export default {
  name: 'pm-search',
  props: {
    query: {
      type: Object,
      default: () => {},
    },
    defaultProp: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {
      visible: false,
      containerWidth: '100%',
      searchQuery: null,
      titles: {},
      formItems: []
    }
  },
  computed: {
    props() {
      if (this.searchQuery) {
        const _props = this.formItems.map(fi => fi.prop)
        return _props.filter(key => this.searchQuery[key] && _props.includes(key) && key !== 'limit' && key !== 'offset').map(key => {
          return { code: key, value: this.searchQuery[key] }
        })
      } else {
        return []
      }
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          const div = this.$refs['searchForm'].$el
          this.containerWidth = div.offsetWidth || div.style.offsetWidth
          this.$nextTick(() => {
            this.formItems = this.getFormItems(this.$refs['searchForm'], 'el-form-item')
          })
        }
      }
    }
  },
  methods: {
    getPropTitle(prop) {
      return this.titles[prop.code] ? this.titles[prop.code].label : ''
    },
    getValueText(prop) {
      if (this.titles[prop.code]) {
        if (Array.isArray(prop.value)) {
          let split = ','
          return prop.value.map(v => {
            if (this.titles[prop.code].type === 'date') {
              split = '至'
            }
            if (v instanceof Date) {
              split = '至'
              return moment(v).format(this.titles[prop.code].format || 'YYYY-MM-DD')
            } else {
              return this.titles[prop.code].options[v] || v
            }
          }).join(split)
        } else {
          return this.titles[prop.code].options[prop.value] || prop.value
        }
      } else {
        return ''
      }
    },
    getFormItems(form, tag = 'el-form-item') {
      let forms = []
      if (Array.isArray(tag)) {
        tag.forEach(t => {
          forms = forms.concat(this.getFormItems(form, t))
        })
      } else {
        if (form.$options._componentTag === tag) {
          forms = [form]
        }
        forms = forms.concat(
          form.$children.filter((c) => c.$options._componentTag === tag)
        )
        form.$children.forEach((c) => {
          forms = unionWith(forms, this.getFormItems(c, tag), isEqual)
        })
      }
      return forms
    },
    setSelected(items) {
      this.searchQuery = {}
      items.forEach(i => {
        this.searchQuery[i.userId] = i.userName
      })
    },
    close() {
      this.visible = false

      document.body.removeEventListener('click', this.close)
    },
    showSearchPophover() {
      this.visible = !this.visible
    },
    initOptions() {
      const formItems = this.getFormItems(this.$refs['searchForm'], 'el-form-item')
      formItems.forEach(fi => {
        if (fi.prop) {
          this.titles[fi.prop] = {
            label: fi.label,
            options: {}
          }
          const radios = this.getFormItems(fi, ['el-radio-button', 'el-radio', 'el-checkbox', 'checkbox-button', 'el-option', 'el-date-picker'])
          if (radios.length > 0) {
            radios.forEach(r => {
              if (r.format || r.valueFormat) {
                this.titles[fi.prop].valueFormat = r.format || r.valueFormat
                this.titles[fi.prop].type = 'date'
              } else if (r.$vnode.tag.indexOf('ElRadio') > -1 || r.$vnode.tag.indexOf('ElCheckbox') > -1) {
                this.titles[fi.prop].options[r.label] = r.$el.innerText
              } else if (r.$options._componentTag === 'el-option') {
                this.titles[fi.prop].options[r.value] = r.label
              }
            })
          }
        }
      })
    },
    seniorSearch() {
      this.searchQuery = { ...this.query }
      this.initOptions()
      this.visible = false
      this.$emit('search')
    },
    search() {
      this.$emit('search')
    },
    resetSearchForm() {
      this.$refs.searchForm.resetFields()
    },
    removeProp(prop) {
      this.query[prop.code] = null
      this.searchQuery[prop.code] = null
      this.search()
    },
    clear() {
      Object.keys(this.query).forEach(key => {
        if (key === 'offset' || key === 'limit') {
          return
        } else {
          this.query[key] = null
          this.searchQuery[key] = null
        }
      })
      this.$refs.searchForm.resetFields()
      this.search()
    }
  },
}
</script>
<style lang="scss" scoped>
  .ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all
  }
</style>
