<template>
  <div>
    <el-form
      :ref="formRef"
      label-width="130px"
      class="position-form classify-form"
      :model="form"
      :rules="validateRules"
    >
      <el-row>
        <el-col :span="12"
          ><el-form-item label="编码" prop="code">
            <el-input v-model="form.code" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="名称" prop="name">
            <el-input v-model="form.name" /> </el-form-item
        ></el-col>
      </el-row>

      <el-row>
        <el-col :span="12"
          ><el-form-item label="类型" prop="types">
            <el-input v-model="form.types" /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="负责人" prop="managerEmpId">
            <el-input v-model="form.managerEmpId" /> </el-form-item
        ></el-col>
      </el-row>

      <el-row>
        <el-col :span="24"
          ><el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="form.description"
            /> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { WorkGroupController } from "@controller";
import { BaseVue, Form, _ } from "@lib";
import model from "./model";
export default {
  name: "",
  mixins: [BaseVue, Form],
  components: {},
  data() {
    return {
      formRef: "groupform",
      form: _.cloneDeep(model),
      model:model,
      validateRules: {
        code: [
          { required: true, message: '请输入应用代码', trigger: 'change' },
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
    // title() {
    //   return `${this.formType === "add" ? "新建" : "编辑"}应用功能`;
    // },
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
        resp = await this.dispatch(WorkGroupController.create, {
          required: true,
          workGroup: {
            ...this.form,
          },
        });
        this.cancel();
      } else if (this.formType === "edit") {
        resp = await this.dispatch(WorkGroupController.update, {
          required: true,
          workGroup: {
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
