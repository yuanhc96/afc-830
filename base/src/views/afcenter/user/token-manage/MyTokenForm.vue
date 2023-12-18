<template>
  <div>
    <el-form
      :ref="formRef"
      :model="form"
      :rules="validateRules"
      label-position="top"      
      label-width="150px"
    >
      <el-row>
        <!-- <el-col :span="22">
          <el-form-item label="用户名称" prop="name">
            <UserSearch :value="form.name" :isSelect="true"/>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="过期时间" prop="expireTime">
            <el-date-picker
              style="width:100%"
              v-model="form.expireTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择过期时间"
              default-time="00:00:00">
            </el-date-picker>
            <!-- :picker-options="expireTimePickerOptions" -->
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb-20">
          <el-form-item label="备注" prop="remark">
            <el-input 
              v-model="form.remark"
              :autosize="{ minRows: 2, maxRows: 4}" 
              type="textarea" 
              maxlength="80" 
              show-word-limit/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="showFooter" style="border-top: 1px" class="div-near-bottom">
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { AfcApiTokenController } from "@controller";
import { BaseVue, Form, _ } from "@lib";
import model from "./model.js";
import UserSearch from "../components/user.vue";

export default {
  name: 'my_token_form',
  components: { UserSearch },
  mixins: [BaseVue, Form],
  props: {
    menu: {},
    params: {},
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formRef: "form",
      model: model,
      form: _.cloneDeep(model),
      // optionsValue: "",
      isAddPptionsValue: false,
      btnLoading: false,
      isIframeResourse: false,
      openTypeOptions: [
        {
          code: "fullScreen",
          name: "全屏模式",
        },
        {
          code: "newOpenWindow",
          name: "新窗口打开",
        },
      ],
      validateRules: {
        expireTime: [
          { required: true, message: "请选择过期时间", trigger: "change" },
        ],
      },
      // expireTimePickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now();
      //   },
      // },
    };
  },
  computed: {
    title() {
      return `${this.formType === "add" ? "新建" : "编辑"}菜单`;
    },
    formType() {
      return this.form.id ? "edit" : "add"
    },
  },
  watch: {},
  mounted() {},
  methods: {
    async validateResolve() {
      this.$emit("update:loading", true);
      let resp = {};
      if (this.formType === "add") {
        const payload = { 
          token: { ...this.form }
        };
        resp = await this.dispatch(AfcApiTokenController.create, payload);
      } 
      else if (this.formType === "edit") {
        const { id, expireTime, remark } = this.form
        const payload = { 
          token: { id, expireTime, remark }
        };
        resp = await this.dispatch(AfcApiTokenController.update, payload);
      }
      this.$emit("update:loading", false);
      if (!resp.error) {
        this.$msg.success("保存成功!");
        this.$emit("success");
        this.$emit("refreshTree");
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
