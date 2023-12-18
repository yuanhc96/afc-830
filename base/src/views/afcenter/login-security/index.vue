<template>
  <div class="pl-20 pr-20 pb-20">
    <el-tabs v-model="activeName">
      <el-tab-pane label="安全设置" name="config">
        <el-form v-loading="loading" :ref="formRef"  :rules="rules" :model="form" class="classify-form" label-width="200px">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="divide-bar">
                <span>密码策略</span>
              </div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="密码最小长度" prop="passwordLength">
                <el-input type="number" :min="1" :max="99" v-model.trim="form.passwordLength" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="密码格式" prop="passwordTypes">
                <el-select v-model="form.passwordTypes" placeholder="请选择" class="w-500px">
                  <el-option
                    v-for="item in passwordTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="密码超时强制修改" prop="isUpdate">
<!--                <el-switch v-model="form.isUpdate" active-value="1" inactive-value="0" />-->
                <el-radio-group v-model="form.isUpdate">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="密码超时提醒(天)" prop="reminderChange">
                <el-input type="number" :min="0" :max="999" v-model.trim="form.reminderChange" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="默认密码强制修改" prop="firstUpdate">
<!--                <el-switch v-model="form.firstUpdate" active-value="1" inactive-value="0" />-->
                <el-radio-group v-model="form.firstUpdate">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <div class="divide-bar">
                <span>锁定策略</span>
              </div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="允许错误登录次数" prop="allowFail">
                <el-input type="number" :min="0" :max="99" v-model.trim="form.allowFail" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="账号锁定时长(分钟)" prop="lockTime">
                <el-input type="number" :min="0" :max="999" v-model.trim="form.lockTime" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="未登录锁定账号(天)" prop="freeTime">
                <el-input type="number" :min="0" :max="999" v-model.trim="form.freeTime" clearable />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <div class="divide-bar">
                <span>多端登录</span>
              </div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="允许员工多端登录" prop="isWatermark">
<!--                <el-switch v-model="form.allowMulLogin"  active-value="1" inactive-value="0" />-->
                <el-radio-group v-model="form.allowMulLogin">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="仅允许不同类终端" prop="isWatermark">
<!--                <el-switch v-model="form.onlyDifTerminal"  active-value="1" inactive-value="0" />-->
                <el-radio-group v-model="form.onlyDifTerminal">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="div-near-bottom">
          <el-button type="primary" :loading="btnLoading" v-permission="FuncCode.afc_f_safety_edit" @click="submit">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="白名单" name="whiteList">
        <div class="top-block">
          <el-row :gutter="20">
            <el-col :span="8">
              <PmToolbar>
                <PmToolbarItem plain v-permission="FuncCode.afc_f_whitelist_add" icon="el-icon-plus" @click="openAdd">添加白名单</PmToolbarItem>
              </PmToolbar>
            </el-col>
            <el-col :span="8" :offset="8">
              <PmSearch
                class="float-right"
                style="width: 300px"
                :query.sync="query"
                defaultProp="name"
                @search="pmSearch"
                placeholder="搜索员工名称"
              >
                <template slot="body">
                  <el-form-item label="员工编号" prop="code">
                    <el-input v-model="query.code" clearable />
                  </el-form-item>
                  <el-form-item label="员工名称" prop="name">
                    <el-input v-model="query.name" clearable />
                  </el-form-item>
                </template>
              </PmSearch>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="SafetyWhitelistController.querySafetyWhitelist.loading"
          height="calc(100vh - 211px)"
          border
          :data="gridList"
          @sort-change="sortChange"
          @selection-change="selectionChange"
        >
          <el-table-column label="员工编号" prop="employee.code"></el-table-column>
          <el-table-column label="名称" prop="employee.name"></el-table-column>
          <el-table-column  label="组织机构" prop="org.name" ></el-table-column>
          <el-table-column  label="岗位" prop="position.name" ></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="{row}">
              <PmToolbar>
                <PmToolbarItem type="text" v-permission="FuncCode.afc_f_whitelist_del" @click="remove(row)">删除</PmToolbarItem>
              </PmToolbar>
            </template>
          </el-table-column>
        </el-table>
         <Pagination :selections="selections" :page-size="query.limit" :current-page.sync="query.offset" :total="gridTotal"
      @size-change="changePageSizer" @current-change="changePage" />
        <SelectUser
          :dialogVisible.sync="dialogVisible"
          :isMultiple="true"
          v-model="selected"
        ></SelectUser>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import { SafetyController, SafetyWhitelistController, UserController } from '@controller'
import { BaseVue, Form, List, VueUtil } from '@lib'
import Base from './base'

export default {
  components: {  },
  mixins: [BaseVue, Form, Base, List],
  props: {},

  data() {
    return {
     users: [],
     activeName: 'config',
     selected: []
    }
  },
  computed: {
    ...VueUtil(this)
      .select([ SafetyController, SafetyWhitelistController, UserController])
      .state(),
    loading() {
      return this.SafetyController.update.loading || this.SafetyController.create.loading
    },
    btnLoading() {
      return this.SafetyController.create.loading || this.SafetyController.update.loading
    }
  },
  watch: {
    selected: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val, 'selected')
        if (val.length) {
          this.addUsers(val)
          // 添加
        }
      }
    },
    activeName(val) {
      if (val === 'config') {
        this.getInfor()
      } else if (val === 'whiteList') {
        this.search()
      }
    }
  },

  created() {
  },

  async mounted() {
    this.getInfor()
    // this.search()
  },

  methods: {
    async getInfor() {
      const res = await this.dispatch(SafetyController.getSafetySite, {
        tenantId: this.currentTenant
      })
      if (!res.error && res.data) {
        this.form = {
          ...this.form,
          ...res.data
        }
      }
    },
    async validateResolve() {
      let res = {}
      if (this.form.id) {
        res = await this.dispatch(SafetyController.update, {
          safetySite: this.form
        })
      } else {
        res = await this.dispatch(SafetyController.create, {
          safetySite: {
            ...this.form,
            tenantId: currentTenant
          }
        })
      }
      if (!res.error) {
        this.getInfor()
        this.$msg.success('保存成功!')
      }
    },
    async getUsers() {
      const res = await this.dispatch(UserController.queryUsers, {
        pageSize: 9999,
        pageIndex: 0
      })
      if (!res.error) {
        this.users = res.data.data
      }
    },
    async searchBody() {
      let resp = await this.dispatch(SafetyWhitelistController.querySafetyWhitelist, {
        name: this.query.name,
        code: this.query.code,
        pageIndex: this.query.offset - 1,
        pageSize: this.query.limit
      })
      return resp
    },
    async addUsers() {
      const ids = this.selected.map(i => i.employee.id)
      const res = await this.dispatch(SafetyWhitelistController.create, ids)
      if (!res.error) {
        this.$msg.success('添加成功!')
        this.search()
        this.selected = []
      }
    },
    async removeBody(row) {
      let payload = [row.employee.id]
      const resp = await this.dispatch(SafetyWhitelistController.deleteSafetyByEmployeeIds, payload)
      return resp
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div#pane-config {
    overflow-y: auto;
    padding-right: 10px;
}
</style>
