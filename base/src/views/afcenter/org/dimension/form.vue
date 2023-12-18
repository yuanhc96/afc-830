<template>
  <div>
    <el-form
      :ref="formRef"
      label-position="top"
      :model="form"
      :rules="validateRules"
    >
      <el-row>
        <el-col :span="24"
          ><el-form-item label="组织维度编号" prop="code">
            <el-input v-focus :disabled="formType==='edit'" v-model.trim="form.code" /> </el-form-item
        ></el-col>
        <el-col :span="24"
          ><el-form-item label="组织维度名称" prop="name">
            <el-input v-model.trim="form.name" /> </el-form-item
        ></el-col>
        <el-col :span="24"
          ><el-form-item label="排序" prop="sortBy">
            <el-input type="number" :min="0" v-model="form.sortBy" /> </el-form-item
        ></el-col>
        <el-col :span="24"
        ><el-form-item label="描述" prop="description">
            <el-input v-model.trim="form.description" type="textarea" :rows="2"/> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { DimensionController } from "@controller";
import { BaseVue, Form, _ } from "@lib";
import model from "./model";
export default {
  name: "",
  mixins: [BaseVue, Form],
  components: {},
  data() {
    let codeTimer = null
    const _this = this
    function validater(rule, value, callback, source, options){
            let api
            if(rule.field==="code"){
              api = DimensionController.findDimensionIsExist
            }else{
               api = DimensionController.findDimensionIsExist
            }

            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value || _this.formType == 'edit') {
                callback()
              } else {
                const count = await _this.dispatch(api, { code: value })
                if (count.data) {
                  callback(new Error(`${value}维度编号已存在!`))
                }
                callback()
              }
            }, 300)
          }
    return {
      formRef: "groupform",
      form: _.cloneDeep(model),
      model:model,
      validateRules: {
        code: [
          { required: true, message: '请输入应用代码', trigger: 'change' },
          {validator:validater}
        ],
        name: [
          { required: true, message: '请输入应用名称', trigger: 'change' },
        ]
      },
    };
  },
  watch: {
    formType(value){
      if(value==='add')
        this.form=_.clone(model);
    }
  },
  computed: {
    title() {
      return `${this.formType === "add" ? "新建" : "编辑"}组织维度`;
    },
    formType() {
      if (this.formData) {
        return "edit";
      } else {
        return "add";
      }
    },
  },
  mounted() {},
  methods: {
    async validateResolve() {
      let resp = {};
      if (this.formType === "add") {
        resp = await this.dispatch(DimensionController.create, {
          required: true,
          dimension: {
            ...this.form,
          },
        });
        this.cancel();
      } else if (this.formType === "edit") {
        resp = await this.dispatch(DimensionController.update, {
          required: true,
          dimension: {
            ...this.form,
          },
        });
      }
      if (!resp.error) {
        this.$msg.success("保存成功!");
        this.$emit("success");
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style></style>
