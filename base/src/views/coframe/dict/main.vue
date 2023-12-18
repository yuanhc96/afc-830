<template>
  <div>
    
        <DictTypeIndex v-on="$listeners" style="height:calc(100vh - 210px);" @selectOne="selectOne" />
     
         <!-- <DictIndex  style="height:calc(100vh - 210px);" :dict-type="selectDictType" /> -->
     
  </div>
</template>

<script>
import { BaseVue } from '@lib'
import DictIndex from './entry/list.vue'
import DictTypeIndex from './type/list.vue'

export default {
  name: 'biz-dict',
  components: { DictTypeIndex, DictIndex },
  mixins: [BaseVue],
  data() {
    return {
      selectDictType: null,
    }
  },
  methods: {
    selectOne(row) {
      this.selectDictType = row
    },
  },
}
</script>
