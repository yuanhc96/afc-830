<template>
    <div>
       <menuMenuManager mark='pc' :currentAppId="currentAppId"/>
    </div>
  </template>
  <script>
  import menuMenuManager from './index.vue'
  export default {
    name:'pc-menu',
    components: {
        menuMenuManager
    },
    props:{
    currentAppId:{
      type: String,
      default:""
    }
    },
    data() {
      return {
      }
    },
    watch: {
    },
    methods: {
    }
  }
  </script>
  <style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .secondary-menu {
   height: calc(100vh - 55px) !important;
  }
  </style>