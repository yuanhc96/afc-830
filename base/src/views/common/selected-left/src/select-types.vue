<template>
  <el-dialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :title="title"
    append-to-body
    width="800px"
  >
    <el-tabs v-model="activeName" :before-leave="beforeLeaveHandle" :class="selectTypes.length === 1 ? 'header-hidden':''">
      <el-tab-pane v-for="item in selectTypes" :label="item.name" :name="item.code" :key="item.code" lazy>
        <el-row :gutter="10">
          <el-col :span="11">
            <select-left
              :ref="item.code + 'selectLeft'"
              v-model="tableDataSelect"
              :isMultiple="isMultiple"
              :tenantId="tenantId"
              :rangeMode="item.rangeMode"
              :rangeData="item.rangeData"
              :activeName="item.type"
              :currentType="item.type"
            />
          </el-col>
          <el-col :span="2">
            <div class="move_btns">
              <div>
                <!-- <el-button type="primary" icon="el-icon-d-arrow-right" @click="addAllUsers" circle></el-button> -->
                <el-button type="primary" icon="el-icon-d-arrow-left" @click="removeAllUsers" circle></el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="right_title p-5">
              <span>{{ rightTitle }}</span>
            </div>
            <div class="block">
              <el-table
                ref="tableRef"
                v-loading="loading"
                :data="tableDataSelect"
                :show-header="false"
                height="399px"
                @select="selectionChangeTable"
              >
                <el-table-column :label="types[activeName]+'名称'" show-overflow-tooltip>
                  <template slot-scope="{row}">
                    {{ types[row.type] + '&nbsp &nbsp' + row.name + '&nbsp &nbsp' +  row.code }}
                  </template>
                </el-table-column>
                <el-table-column width="80px">
                  <template slot-scope="{row}">
                    <el-button type="text" icon="el-icon-delete" @click="removeRow(row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BaseVue, Form, List } from '@lib'
import { SelectionComponentController } from '@controller'
import SelectLeft from './index'
import Model from './model.js'

export default {
  name: 'select-user',
  components: { SelectLeft },
  mixins: [BaseVue, Form, List, Model],
  props: {
    // value: {},
    title: {
      type: String,
      default: '添加成员'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tenantId: {
      type: String,
      default: null
    },
    // 模式:'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺
    // 模式:同机构--'dimension',维度;'rootOrgs'指定机构ids,codes为根;'orgs'指定机构ids,codes平铺;'roles'指定角色ids,codes;'emps'人员ids,codes
    // 模式:'roles',指定角色ids,codes;rangeData,不传参，当前所有的
    rangeMode: {
      required: true,
      type: Object,
      default: {
        emp: 'dimension',
        org: 'dimension',
        role: 'roles'
      }
    },
    // {dimensionCode: 'def_dimension'}
    // {ids: [...]}
    // {codes: [...]}
    rangeData: {
      required: true,
      type: Object,
      default: {
        emp: { dimensionCode: 'def_dimension' },
        org: { dimensionCode: 'def_dimension' },
        role: null
      }
    }
  },
  data() {
    return {
      activeName: 'emp',
      tableDataSelect: [],
      rootNode: {},
      selectTypes: [{
        name: '人员',
        code: 'emp',
        type: 'emp',
        rangeMode: {
          emp: 'dimension'
        },
        rangeData: {
          emp: { dimensionCode: 'def_dimension' }
        }
      },{
        name: '机构',
        code: 'org',
        type: 'org',
        rangeMode: {
          org: 'dimension'
        },
        rangeData: {
          org: { dimensionCode: 'def_dimension' }
        }
      },{
        name: '角色',
        code: 'role',
        type: 'role',
        rangeMode: {
          role: 'roles'
        },
        rangeData: {
          role: null
        }
      }]
    }
  },
  computed: {
    rightTitle() {
      const isMultiple = ' (' + `${this.isMultiple ? '多选' : '单选'}` + ')'
      return '已选' + isMultiple
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handleClick() {
      const selectLeft = this.$refs[this.activeName + 'selectLeft']
      selectLeft.length && selectLeft[0].toggleRowSelection()
    },
    beforeLeaveHandle(activeName, oldActiveName){
      const prefixData = this.tableDataSelect.filter(i => i.type === activeName)
      const suffixData = this.tableDataSelect.filter(i => i.type !== activeName)
      this.$set(this, 'tableDataSelect', _.concat(prefixData, suffixData))
    },
    cancel() {
      this.reset()
      this.$emit('update:dialogVisible', false)
    },
    reset() {
      this.activeName = 'emp'
      this.tableDataSelect = []
    },
    sure() {
      if (this.isMultiple) {
        this.$emit('change', this.tableDataSelect)
      } else {
        this.$emit('change', this.tableDataSelect[0])
      }
      this.cancel()
    },
    removeRow(row) {
      this.tableDataSelect.forEach((item, index) => {
        if (item.id === row.id && item.type === row.type) {
          this.tableDataSelect.splice(index, 1)
        }
      })
      this.handleClick()
    },
    async addAllUsers() {
      // 当前页面能看到的全部
      
    },
    removeAllUsers() {
      this.handleClick()
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    height: 420px;
    .block {
      height: 400px;
      overflow: auto;
      border: 1px solid #ddd;
      border-top: none;
    }
    .right_title {
      border: 1px solid #ddd;
      background: #f5f5f5;
      color: #8f8888;
      padding-left: 10px;
      height: 28px;
    }
    .move_btns {
      margin-top: 170px;
      text-align: center;
      :nth-child(2) {
        margin: 15px 0 0 ;
      }
      :nth-child(3) {
        margin: 40px 0 0 ;
      }
      :nth-child(4) {
        margin: 15px 0 0 ;
      }
    }
  }
</style>
