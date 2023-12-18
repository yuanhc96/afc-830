<template>
  <div class="sub-body">
    <template>
      <div style="min-height:500px;">
        <el-tabs v-model="tab" @tab-click="handleClick">
          <el-tab-pane name="info" label="角色信息">
            <Info ref="info"  class="mt-10" :style="{ width: '100%' }" :form="form" form-type="edit" @validateResolve="validateResolve">
              <template slot="infoFooter">
                <div class="footer">
                  <div style="border-top: 1px;" class="div-near-bottom">
                    <el-button type="primary" :loading="loading" @click="submitInfoHandle">保存</el-button>
                  </div>
                </div>
              </template>
            </Info>
          </el-tab-pane>
          <el-tab-pane name="resource" lazy label="权限">
            <Resources :currentAppId="currentAppId" :form="form" :props="props" />
          </el-tab-pane>
          <el-tab-pane v-if="this.props.type!=='businessObject'" name="member" lazy label="成员管理">
            <Member :form="form" />
          </el-tab-pane>
         
        </el-tabs>
      </div>
    </template>
  </div>
</template>
<script>
import { RoleController } from '@controller'
import { BaseVue } from '@lib'
import Info from './tabs/info.vue'
import Member from './tabs/member.vue'
import Resources from './tabs/resources.vue'
export default {
  name: 'detail',
  components: { Resources, Info, Member },
  mixins: [BaseVue],
  props: {
    props: {
      type: Object
    },
    form: {
      type: Object
    },
    currentIndex: {
      type: String
    },
    currentAppId:{
      type: String,
      default:""
    }
  },
  data() {
    return {
      // model: model,
      // form: _.cloneDeep(model),
      tab: 'resource',
      loading: false
    }
  },
  watch: {
    currentIndex: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.currentIndex == 2) {
          this.tab = 'member'
        } else if (this.currentIndex == 0) {
          this.tab = 'info'
        } else if (this.currentIndex == 1) {
          this.tab = 'resource'
        }
      },
    }
  },
  methods: {
    async validateResolve() {
      this.loading = true
      this.form.types = this.props.type
      const resp = await this.dispatch(RoleController.update, {
        role: this.form
      })
      this.loading = false
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
      }
    },
    submitInfoHandle() {
      this.$refs.info.submit()
    },
    handleClick() {

    }
  },
}
</script>
<style scoped lang="scss">
::v-deep  .secondary-menu {
  height: calc(100vh - 113px) !important;
}
.sub-body{
  height: calc(100vh - 135px) !important;
  position: relative;
  margin-left: -5px;
}
.footer{
  text-align: right;
}
</style>
