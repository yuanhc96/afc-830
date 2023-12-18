<template>
  <el-dialog width="800px" :visible.sync="dialogVisible" title="资源信息" top="60px" append-to-body @close="cancel">
    <div v-if="resourceData.length === 0" style="height:500px;">
      <no-data text="模板数据暂无更新" style="padding-top: 150px;"></no-data>
    </div>
    <el-tabs v-else v-model="activeName">
      <el-tab-pane v-for="(resource, index) in resourceData" :key="index" :label="types[resource.key]" :name="resource.key">
        <el-table :highlight-current-row="true" border stripe height="400px" :data="resource.value">
          <el-table-column label="编码" prop="code" show-overflow-tooltip />
          <el-table-column label="名称" prop="name" show-overflow-tooltip />
        </el-table>
        <div style="text-align: right; margin-top: 10px">共 {{ resource.value.length }} 条</div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="syncDisabled" :loading="btnLoading" @click="submit">同步</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { TenantUpgradeController } from '@controller'
import { BaseVue, Form, VueUtil, _ } from '@lib'
export default {
  name:'detail',
  mixins: [BaseVue, Form],
  props:{
    dialogVisible:{
        type: Boolean
    },
   
  },
  data() {
    return {
      formRef: 'form',
      activeName: '',
      resourceData: [],
      initData: null,
      types: {
        dictType: '业务字典类型',
        dictEntry: '业务字典实体',
        resGroup: '资源分组',
        resource: '资源',
        menu: '菜单',
        businessObject: '业务对象',
        role: '角色',
        systemVariable: '系统变量',
        app: '应用',
        dataLevel: '数据层级'
      }
    }
  },
  computed: {
    ...VueUtil(this)
      .select([TenantUpgradeController])
      .state(),
    btnLoading() {
      return this.TenantUpgradeController.updateTenantTemplateData.loading
    },
    syncDisabled() {
      return !this.resourceData.length
    }
  },
  created(){
    this.getSourceData()
  },
  methods: {
    async submit() {
      const resp = await this.dispatch(TenantUpgradeController.updateTenantTemplateData, {
        upgradeData: this.initData
      })
      if (!resp.error) {
        this.cancel()
        this.$msg.success('同步成功， 请稍后刷新查看！')
      }
    },
    cancel(){
      this.$emit('update:dialogVisible',false)
    },
    async getSourceData(){
      const resp = await this.dispatch(TenantUpgradeController.queryTenantUpgradeTemplateData, {
        pageIndex: 0,
        pageSize: -1,
      })
      if (!resp.error) {
        this.initData = _.cloneDeep(resp.data)
        let resourceData = []
        Object.keys(this.initData).forEach(key => {
          resourceData.push({
            key: key,
            value: this.initData[key].data})
        })
        this.resourceData = _.cloneDeep(resourceData)
        if (this.resourceData.length) {
          this.activeName = this.resourceData[0].key
        }
      }
    },
  },
}
</script>