<template>
  <el-dialog :fullscreen="true" :close-on-click-modal="false" :append-to-body="true" title="测试" width="90%" :visible.sync="visible">
    <el-row>
      <el-col :span="4">
        <el-tree :data="tree" />
      </el-col>
      <el-col :span="20">
        <el-form label-width="110px" inline>
          <el-form-item label="appCode">
            <el-input v-model="appCode" />
          </el-form-item>
          <el-form-item label="moduleCode">
            <el-input v-model="moduleCode" />
          </el-form-item>
          <el-form-item label="resourceType">
            <el-select v-model="resourceType" allow-create>
              <el-option label="表单(form)" value="form" />
              <el-option label="视图(view)" value="view" />
            </el-select>
          </el-form-item>
          <el-form-item label="resourceCode">
            <el-input v-model="resourceCode" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="load">重新加载</el-button>
          </el-form-item>
        </el-form>
        <template>
          <pm-clip-button :data="url">
            {{ url }}
            <el-button>点击复制</el-button>
          </pm-clip-button>
          <el-divider />
          <RemoteComponent ref="remoteComponent" :resource-type="resourceType" :resource-code="resourceCode" :app-code="appCode" :module-code="moduleCode" :before-load="[]" />
        </template></el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import RemoteComponent from '@/components/RemoteComponent/index.vue'
export default {
  components: { RemoteComponent },
  data() {
    return {
      visible: false,
      component: null,
      appCode: 'formDesigner',
      moduleCode: 'render',
      resourceCode: '97525',
      resourceType: 'form',
      key: '123',
      tree: [
        {
          label: '微前端表单',
          id: 'micro-form',
        }
      ]
    }
  },
  computed: {
    url() {
      return `http://${window.location.host}/#/app/${this.appCode}/module/${this.moduleCode}?resourceCode=${this.resourceCode}&resourceType=${this.resourceType}`
    }
  },
  created() {
    this.$BaseBus.$on('openTest', () => {
      this.visible = true
    })
  },
  methods: {
    load() {
      this.$refs['remoteComponent'].reload()
    },
    openTest() {
      this.visible = true
    }
  }
}
</script>
