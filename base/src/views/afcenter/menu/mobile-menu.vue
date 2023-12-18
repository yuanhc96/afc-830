<template>
    <div>
       <menuMenuManager mark='mobile'/>
    </div>
  </template>
  <script>
  import menuMenuManager from './index.vue'
  export default {
    name:'mobile-menu',
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
  </style>