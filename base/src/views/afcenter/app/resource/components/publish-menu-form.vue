<template>
  <div>
    <el-dialog
      v-if="menuDialogVisible"
      title="新建非叶子菜单"
      :visible.sync="menuDialogVisible"
      width="500px"
      height="380px"
      append-to-body
      :before-close="handleClose"
    >
      <div style="height: 380px; overflow: auto; font-size: 15px">

        <el-form ref="menu" class="new-form" :model="menu" label-width="120px" :rules="validateRules" size="mini">

          <el-form-item label="编号" prop="code" class="pb-15">
            <el-input v-model.trim="menu.code" v-focus class="p-100w" />
          </el-form-item>
          <el-form-item label="名称" prop="name" class="pb-15">
            <el-input v-model.trim="menu.name" class="p-100w" />
          </el-form-item>
          <el-form-item label="图标" prop="menuIcon" class="pb-15">
            <PmSelectIcon v-model="menu.menuIcon" placeholder="请选择菜单图标" />
          </el-form-item>
          <el-form-item label="显示顺序" prop="sortNo" class="pb-15">
            <el-input v-model="menu.sortNo" type="number" min="1" max="99" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MenuController } from '@controller'
import { BaseVue, List } from '@lib'
import localStore from 'store'
export default {
  mixins: [BaseVue, List],
  props: {
    menuDialogVisible: {
      type: Boolean,
      default: false,
    },
    menuForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    parentMenu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    appId: {
      type: String,
      default: null
    },
  },
  data() {
    let nameTimer = null
    return {
      menu: {
        id: null,
        name: null,
        code: null,
        description: null,
        sortNo: 1,
        isLeaf: '0',
        treeLevel: null,
        seq: null,
        parentId: this.parentMenu.id,
        tenantId: null,
        menuIcon: null,
        isFixed: null,
        openType: null,
        resource: {
        },
        isNewWindowOpen: null,
        funcname: null,
        menuType: this.menuForm.mark === 'mobile' ? 'mobile' : null,
        appId: this.appId || null,
      },
      validateRules: {
        code: [
          { required: true, message: '请输入菜单编号!', trigger: 'blur' },
          {
            validator: (rule, value, callback, source, options) => {
              if (value && /[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('编码不能输入汉字'))
              }
              if (nameTimer !== null) {
                clearTimeout(nameTimer)
              }
              if (!value) {
                callback()
              } else {
                nameTimer = setTimeout(async() => {
                  const res = await this.dispatch(MenuController.isExist, {
                    code: value,
                    tenantId: this.currentTenant,
                  })
                  if (res == true) {
                    callback(new Error(`${value}编码已存在!`))
                  }
                  callback()
                }, 300)
              }
            },
          },
        ],
        name: [{ required: true, trigger: 'blur', message: '菜单名称不能为空!' }],
      },
    }
  },
  computed: {
    userInfo() {
      return localStore.get('user') || {}
    },
    currentTenant() {
      return this.userInfo && this.userInfo.attributes && this.userInfo.attributes['TENANT_ID']
    },
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('update:menuDialogVisible', false)
    },
    async submit() {
      const resp = await this.dispatch(MenuController.create, { menu: this.menu })
      if (!resp.error) {
        this.$message({
          message: '添加菜单成功',
          type: 'success'
        })
        this.$emit('addMenuSuccess')
      }
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
