<template>
  <PmFormDialog
    :title="actionTitle + '用户'"
    ok-text="确定"
    :dialog-visible.sync="actionVisible"
    width="800px"
  >
    <el-transfer slot="form" v-model="value" :data="data"></el-transfer>
  </PmFormDialog>
</template>

<script>
export default {
  name: "CoframeForm",
  props: {
    actionVisible: { type: Boolean, default: ()=>false },
    actionVisible: { type: String, default: ()=>"添加" },
  },
  data() {
    const generateData = (_) => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0,
        });
      }
      return data;
    };
    return {
      data: generateData(),
      value: [1, 4],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
