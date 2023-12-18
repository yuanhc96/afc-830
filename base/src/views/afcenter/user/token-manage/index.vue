<template>
  <PmDialog
    :visible.sync="dialogVisible"
    :title="title"
    :inline="true"
    :show-close="showClose"
    :loading="loading"
    okText="确定"
    top="60px"
    class="body-no-padding"
    width="80%"
  >
    <MyTokenList />
    <span slot="footer">
      <el-button v-if="showClose" @click="dialogVisible = false" size="mini"
        >关闭</el-button
      >
      <!-- <el-button v-if="showClose" @click="cancel" size="mini">取消</el-button> -->
    </span>
  </PmDialog>
</template>

<script>
import MyTokenList from "./MyTokenList.vue";

export default {
  name: "token_manage",
  components: {
    MyTokenList,
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return `个人 token管理`;
    },
  },
  watch: {
    dialogVisible(val) {
      this.$emit("dialogVisible:update", val);
      this.$parent.tokenManageShow = val;
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  padding: 10px 20px 30px 20px !important;
}
</style>
