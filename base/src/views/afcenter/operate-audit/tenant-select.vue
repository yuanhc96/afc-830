<template>
  <div>
    <el-dropdown
      v-loading="loading"
      placement="bottom-start"
      size="small"
      trigger="click"
      element-loading-spinner="none"
      @command="choosetenant"
    >
      <el-input v-model="currentLabel" :placeholder="label" :style="`width: ${width}px`" :disabled="isDisabled">
        <div slot="suffix" style="width: 38px;background: #fff;margin: 1px 0;height: 89%;">
          <i v-if="!!value" style="color:rgb(192, 196, 204)" class="el-icon-circle-close" @click.stop="reset" />
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
      </el-input>
      <el-dropdown-menu slot="dropdown">
        <div>
          <!-- <el-input
            v-model="keyword"
            class="p-5 pt-0"
            clearable
            placeholder="检索..."
            :validate-event="false"
            @keypress.enter.native.stop="search"
            :style="`width: ${width}px`"
          /> -->
          <div :style="`width: ${width}px`">
            <el-dropdown-item v-for="item in tenantData" :key="item.id" :style="highLightRow(item)" :command="item">{{ item.name }}</el-dropdown-item>
          </div>
          <div class="text-right">
            <pm-pagination :page-sizes="[10, 20, 30, 40, 50, 100]" small layout="prev,pager,next" :total="total" @current-change="changePage" />
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { TenantController } from '@controller'
import { BaseVue, List } from '@lib'
import _ from 'lodash'
export default {
  name: 'member-select',
  mixins: [BaseVue, List],
  props: {
    label: {
      type: String,
      default: '请选择用户',
    },
    width: {
      type: String,
      default: '454',
    },
    value: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: '300px',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    valuePath: {
      default: 'id'
    },
  },

  data() {
    return {
      keyword: null,
      loading: false,
      tenantData: [],
      total: 0,
    }
  },
  computed: {
    currentLabel() {
      const {id, code, name} = this.value || {}
      return id ? name + '(' + code + ')' : ''
    }
  },

  watch: {
    // keyword() {
    //   this.debouncedGetAnswer()
    // },

    // value: {
    //   immediate: true,
    //   handler(val) {
    //     if (val === null || val === '') {
    //       this.currentLabel = null
    //     } else {
    //       this.gettenantData(val)
    //     }
    //   },
    // },
  },
  deactivated() {
    this.query.offset = 1
    this.query.limit = 10
  },
  created: function() {
    this.debouncedGetAnswer = _.debounce(item => {
      this.search()
    }, 300)
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      this.query.offset = 1
      this.gettenantData()
    },
    async gettenantData(obj) {
      let params = this.query
      // if (obj.name) {
      //   params = {
      //     ...params,
      //     ...obj
      //   }
      // }
      this.loading = true
      const res = await this.dispatch(TenantController.queryTenantsByCriteria, {
        ...params,
      })
      if (!res.error) {
        this.total = res.data.total
        this.tenantData = res.data.data
      }
      this.loading = false
    },
    changePage(offset) {
      this.query.offset = offset
      this.gettenantData()
    },
    choosetenant(row) {
      this.$emit('change', _.cloneDeep(row))
    },
    reset() {
      this.$emit('input', null)
    },
    highLightRow(row) {
      if (_.get(row, this.valuePath) === this.value) {
        return `background-color:#f5f7fa`
      } else {
        return {}
      }
    },
  },
}
</script>

<style scoped></style>
