<template>
  <div>
    <el-row type="flex" class="row">
      <el-col style="width:200px" class="pl-10">
        <el-checkbox class="mr-10" :label="value.id" :disabled="disabled" @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">
          {{ value.name }}
        </el-checkbox>
      </el-col>
      <el-col>
        <div v-if="value.resources.length > 0">
          <el-checkbox
            v-for="(item,index) in value.resources"
            :label="item.id"
            :key="item.id"
            v-model="item.selected"
            @change="handleCheckedChange($event,item,index)"
            style="margin-left:0px;margin-right:30px;"
            >
            {{ item.name }}
          </el-checkbox>
        </div>
        <div v-else style="color:#c0c4cc;">无数据</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue, List } from '@lib'
import {
  ResourceController,
  ResGroupController
} from '@controller'
export default {
  name: 'row-checkbox',
  mixins: [BaseVue,List],
  props: {
    value: Object,
    currentResouces:Object
  },

  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      disabled: false
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
         this.isCheckedAllRole(val.resources)
      },
    },
  },
  methods: {
    isCheckedAllRole(val) {
      if(val.length>0){
        this.disabled = false
        this.checkAll = val.every(v => {
          return v.selected === true
        })
      }else{
        this.disabled = true
        this.checkAll = false
      }
      
      if (!this.checkAll) {
        this.isIndeterminate = val.some(v => {
          return v.selected === true
        })
      } else {
        this.isIndeterminate = false
      }
    },
    handleCheckedChange(checked,val,index) {
      val.selected = checked
      this.$set(this.value.resources,index,val)
      this.$emit('submitResHandle',checked,[val],this.value.id)
    },
    async handleCheckAllChange(checked,value) {
      if (this.value.resources.length > 0) {
        this.filterCheckAllChange(checked)
      }
    },
    filterCheckAllChange(val) {
      this.value.resources.forEach(v => {
        v.selected = val
      })
      this.$emit('submitResHandle',val,this.value.resources,this.value.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.row {
  min-height: 36px;
  line-height: 36px;
  font-size: 14px;

  &:hover {
    background: #e0e0e0;
  }
}
</style>
