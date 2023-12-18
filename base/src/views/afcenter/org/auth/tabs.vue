<comment>
// 弹窗tab组件
</comment>
<template>
  <div>
      <el-tabs>
        <el-tab-pane v-for="(item,index) in items" :label="item.label" :key="index" :name="item.name">
            <slot :name="item.slot"></slot>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  components: {},
  props: {
      items:[]
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style></style>
