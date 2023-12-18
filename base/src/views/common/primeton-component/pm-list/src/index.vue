<!--<template>-->
<!--  <div class="pm-list">-->
<!--    <div v-for="item in data" :key="data.id" class="pm-list-item">-->
<!--      <div class="handler"><i class="el-icon-s-operation" /></div>-->
<!--      <div class="content">{{ item.label }}</div>-->
<!--    </div>-->
<!--    <div class="pm-list-item edit">-->
<!--      <div class="handler"><i class="el-icon-plus" /></div>-->
<!--      <slot v-if="$slots['edit']" name="edit" />-->
<!--      <el-input v-else v-model="value" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--  props: {-->
<!--    data: {-->
<!--      type: Array,-->
<!--      default: []-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      value: null,-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    save() {-->
<!--      this.$emit('save', this.value)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--  $height: 30px;-->
<!--  .pm-list{-->
<!--    border:1px solid #e8e8e8;-->
<!--    border-radius: 2px;-->
<!--    .pm-list-item{-->
<!--      display: flex;-->
<!--      border-bottom: 1px solid #e8e8e8;-->
<!--      height: $height;-->
<!--      line-height: $height;-->
<!--      .handler{-->
<!--        width: 30px;-->
<!--        text-align: center;-->
<!--        cursor: move;-->
<!--      }-->
<!--      ::v-deep .el-input__inner{-->
<!--        border:none;-->
<!--        padding-left:0px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
