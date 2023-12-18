<template>
  <el-row :gutter="0" class="pagination" :class="{border:border}" data-testId="分页信息">
    <el-col v-if="showSelections" :span="5" class="pt-10 pl-10">
      &nbsp;<span>已选中 <span class="fb-700">{{ selections.length }}</span> 条</span>
    </el-col>
    <el-col :span="spanNum" class="text-right pr-10">
      <el-pagination
        :page-sizes="pageSizes"
        :layout="layout"
        background
        v-bind="$attrs"
        class="mb-10"
        v-on="$listeners"
      />
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'pagination',
  props: {
    layout: {
      default: 'total, sizes, prev, pager, next, jumper'
    },
    selections: {
      type: Array,
      default: () => []
    },
    pageSizes: {
      default: () => [10, 20, 30, 40, 50]
    },
    border: {
      default: true,
    }
  },
  computed: {
    showSelections() {
      return this.selections && this.selections.length > 0
    },
    spanNum() {
      const num = this.showSelections ? 19 : 24
      return num
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-pagination.is-background .el-pager li{
  min-width: 23px;
  line-height: 23px;
  border-radius: 5px;
  font-weight:normal;
  &:hover{
    background: rgba(24, 144, 255,.1)!important ;
  }
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active{
  color: var(--tagBg)!important;
  background:#fff!important;
  font-weight: 700;
}
.border{
  border:1px solid #e5e5e5;
  border-top:none;
  padding-top:4px;
  padding-bottom:4px;
}
</style>
