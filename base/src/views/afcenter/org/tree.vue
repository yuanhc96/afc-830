<template>
  <div>
    <PmTree ref="tree" :props="props" :data="data" v-model="selectNode">
      <TreeNode slot="row" slot-scope="{ node, data }">
        <template slot="label">
          <span>{{ node.label }}</span>
        </template>
      </TreeNode>
    </PmTree>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
      data:[]
  },
  data() {
    return {
      selectNode: null,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style></style>
