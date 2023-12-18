<template>
  <div style="width:200px;" >
    <PmTree
      class="mt-10"
      ref="treeBox"
      @current-change="nodeChange"
      :data="treeData"
      node-key="id"
      :searchable="false"
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="[defaultCheckedKeys]"
    >
      <TreeNode slot="row" slot-scope="{ node, data }">
        <template slot="label">
          <div style="width:150px;">
             <div class="custom-tree-node">       
             <i v-if="data.id === 'icon'" class="el-icon-menu"></i>
             <i v-else-if="data.id === 'image'" class="el-icon-picture-outline"></i>
             <i v-else class="el-icon-folder"></i>
             <el-tooltip class="item" effect="light" :content="node.label" placement="bottom">
              <el-buttom style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:left;margin-left:2px">{{node.label}}</el-buttom>
             </el-tooltip>  
            </div>          
          </div>
        </template>
        <template slot="more">
          <el-dropdown
            size="medium"
            trigger="click"
            placement="bottom-start"
            @command="clickMoreButton"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu size="medium" slot="dropdown">
            <el-dropdown-item
                class="ml-10 mr-10"
                icon="el-icon-plus"
                command="updateNode"
                @click.native="openAdd"
              >新建{{data.id === 'icon' ? 'svg' : ''}}分组</el-dropdown-item>
              <el-upload
                v-if="data.id === 'icon'"
                accept=".zip,.rar,.arj"
                :http-request="uploadMethod"
                :file-list="fileList"
                >
                <el-dropdown-item
                  class="ml-10 mr-10"
                  icon="el-icon-plus"
                  command="uploadFont"
                >新建font图标</el-dropdown-item>
              </el-upload>
              <el-dropdown-item
                icon="el-icon-download"
                command="export"
                @click.native="handleExport(data.id)">导出{{ data.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </TreeNode>
    </PmTree>
    <!-- <pm-dialog width="800px" :title="formTtile" :visible.sync="dialogVisible"  okText="确定" :loading="btnLoading">
      <el-form
        :ref="formRef"
        label-width="130px"
        class="classify-form"
        :model="form"
        :showFooter="true"
        :rules="validateRules"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="分组编码" prop="code">
              <el-input :disabled="formType==='edit'"  v-model="form.code" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="分组名称" prop='name'>
              <el-input v-model="form.name" /> 
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" @click="submit">确定</el-button>
      </span>
    </pm-dialog> -->
    <GroupForm :dialog-visible.sync="dialogVisible" :typeId="value" @success="success"></GroupForm>
  </div>
</template>
<script>
import { MaterialGroupController } from "@controller";
import { BaseVue, Form } from "@lib";
import GroupForm from "./group/form.vue";
import model from "./group/model.js";
export default {
  mixins: [BaseVue, Form, model],
  components: { GroupForm },
  props: {
    value: {
      type: String,
      default: 'icon'
    },
  },
  data() {
    return {
      formRef: 'formRef',
      filterText:'',
      dialogVisible: false,
      expandedKeys: [],
      defaultCheckedKeys: null,
      treeData: [{
        name: '图标',
        id: 'icon',
        code: 'icon'
      },{
        name: '图片',
        id: 'image',
        code: 'image'
      },{
        name: '附件',
        id: 'attachment',
        code: 'attachment'
      }],
      formType: 'add',
      typeId: 'icon',
      fileList: []
    };
  },
  computed: {
    formTtile() {
      const type = this.formType === 'add' ? '新增' : '修改'
      const currentType = this.treeData.filter(i => i.id === this.value)
      return `${type}${currentType.length ? currentType[0].name : ''}分组`
    },
    btnLoading() {
      return false
    }
  },
  mounted() {
    // this.init();
  },
  watch: {
    value: {
      immediate: true,
      async handler(val) {
        if (val) {
          // 选中
          this.$nextTick(() => {
            this.$refs['treeBox'].setCurrentKey(val)
          })
        } else {
          if (this.treeData.length) {
            this.$emit('input', this.treeData[0].id)
          } else {
            // this.treeData = await this.getTreeData()
            // this.$emit('value', this.treeData[0].id)
          }
        }
      }
    },
    // filterText(val) {
    //   this.treeData = this.treelist.filter(res=>res.name.indexOf(val.trim())!=-1) 
    // },
  },
  methods: {
    async init() {
    },
    async validateResolve() {
      let resp = {}
      if (this.formType === 'add') {
        resp = await this.dispatch(MaterialGroupController.create, {
        payload: {
            materialGroup: {
              ...this.form,
              materialType: this.value
            }
          }
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(MaterialGroupController.update, {
          payload: {
            resGroup: this.form,
          }
        })
      }
      this.$emit('update:loading',false)
      if (!resp.error) {
        this.successMessage('保存成功!')
        this.$emit('refresh')
        return true
      } else {
        return false
      }
    },
    
    openAdd(data) {
      this.dialogVisible = true;
      this.formType = 'add';
    },
    // cancel() {
    //   this.dialogVisible = false
    //   setTimeout(() => {
    //     this.form = _.cloneDeep(model || {})
    //     this.$nextTick(() => {
    //       this.$refs[this.formRef] && this.$refs[this.formRef].clearValidate()
    //     })
    //   }, 300)
    // },
    
    nodeChange(node) {
      this.typeId = node.id
      this.$emit("input", node.id)
      
    },
    success() {
      this.$emit('refresh')
    },
    getGroups() {
      this.success()
    }
  }
};
</script>

<style lang="scss" scoped>

.pm-tree {
  height: calc(100vh - 210px);
  overflow-y: auto;
}
::v-deep .hamburger{
  display: none !important;
}
.add-org{
  width: 190px;
}
.custom-tree-node{
  display: flex;
  align-items: center;
}
.svgicon{
  width:12px;
  height:10px;
  margin-right: 10px;
}
::v-deep .el-dialog__body {
  padding: 10px 20px 0px 20px !important;
}

::v-deep .hamburger{
  display: none !important;
}


</style>