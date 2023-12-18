<template>
  <pm-dialog width="480px" :title="formTtile" :visible.sync="dialogVisible"  okText="确定" :loading="btnLoading">
    <el-form
      :ref="formRef"
      label-width="130px"
      :model="form"
      label-position="top"
      :showFooter="true"
      :rules="validateRules"
    >
      <el-row :gutter="20">
        <el-col v-if="formType === 'add'" :span="24">
          <el-form-item label="分组编码" prop="code">
            <el-input :disabled="formType==='edit'"  v-model="form.code" />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb-50">
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
  </pm-dialog>
</template>
<script>
import { MaterialGroupController } from "@controller";
import { BaseVue, Form, _ } from "@lib";
import model from "./model.js";
const form = {
  name: null,
  code: null
}
export default {
  mixins: [BaseVue, Form, model],
  props: {
    typeId: {
      type: String,
      default: 'icon'
    },
  },
  data() {
    return {
      formRef: 'formRef',
      form: _.cloneDeep(form),
      filterText:'',
      dialogVisible: false,
      query: {
        limit: 10,
        offset: 1
      },
      expandedKeys: [],
      defaultCheckedKeys: null,
      // formType: 'add'
    };
  },
  computed: {
    formType() {
      console.log(this.form, '===form')
      return this.form && this.form.id ? 'edit' : 'add'
    },
    formTtile() {
      const type = this.formType === 'add' ? '新增' : '修改'
      const currentType = this.treeData.filter(i => i.id === this.typeId)
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
    // value: {
    //   immediate: true,
    //   async handler(val) {
    //     if (val) {
    //       // 选中
    //       this.$nextTick(() => {
    //         this.$refs['treeBox'].setCurrentKey(val)
    //       })
    //     } else {
    //       if (this.treeData.length) {
    //         this.$emit('input', this.treeData[0].id)
    //       } else {
    //         // this.treeData = await this.getTreeData()
    //         // this.$emit('value', this.treeData[0].id)
    //       }
    //     }
    //   }
    // },
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
              materialType: this.typeId
            }
          }
        })
        this.cancel()
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(MaterialGroupController.update, {
          payload: {
            materialGroup: this.form,
          }
        })
      }
      if (!resp.error) {
        this.$emit('update:dialogVisible',false)
        this.successMessage('保存成功!')
        this.$emit('success')
        return true
      } else {
        return false
      }
    },
    
    cancel() {
      this.$emit('update:formData', null)
      this.$emit('update:dialogVisible', false)
      setTimeout(() => {
        this.form = _.cloneDeep(form || {})
        this.$nextTick(() => {
          this.$refs[this.formRef] && this.$refs[this.formRef].clearValidate()
        })
      }, 300)
    },
    
    nodeChange(node) {
      console.log(node,'treenode');
      this.$emit("input", node.id);
      
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

</style>