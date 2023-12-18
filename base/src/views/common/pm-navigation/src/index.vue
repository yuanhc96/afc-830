<template>
  <div class="body">
    <el-row :gutter="20" type="flex">
      <el-col class="leftbar" v-if="paths.length >= 2 && !noBackInclude.includes(currentRoute.name) ">
        <el-tooltip content="返回">
          <i @click.stop="back" class="el-icon-back back ml-5"/>
        </el-tooltip>
      </el-col>
      <el-col style="flex:1;">
        <!-- <transition name="el-fade-in-linear" leave-to-class="leave-to-class"> -->
        <keep-alive :include="cacheInclude">
          <component
            :is="currentRoute.component"
            ref="componentPage"
            v-bind="currentRoute.props"
            @goto="goto"
            v-on="$listeners"
          />
        </keep-alive>
      <!-- </transition> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'pm-navigation',
  props: {
    routes: {
      type: Array,
      default: () => []
    },
    bodyStyle: {
      type: String,
      default: ''
    },
    autoInit: {
      type: Boolean,
      default: true
    },
    cacheInclude: {
      type: Array,
      default: () => []
    },
    noBackInclude:{
      type: Array,
      default: () => []
    },
    allowClick: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      currentRoute: {},
      paths: [],
    }
  },
  mounted() {
    this.paths = [this.routes[0]]
    if (this.autoInit) {
      this.goto(this.routes[0])
    }
  },
  methods: {
    back(){
      const parentRoutes = this.findParentWithRouteName(this.routes,this.currentRoute.name)
      this.goto(parentRoutes)
    },
    goto({ name, props, title, _title }) {
      const paths = []
      const search = routes => {
        let end = false
        routes.forEach(route => {
          if (route.name === name || (route.children && search(route.children))) {
            if (route.name === name) {
              if (this.$refs['componentPage'] && this.$refs['componentPage'].beforeAfter) {
                this.$refs['componentPage'].beforeAfter(() => {
                  this.currentRoute = route
                  if (props) {
                    //  route.props = props;
                    route.props = { ...route.props, ...props }
                    route._title = _title || title
                  }
                })
              } else {
                this.currentRoute = route
                if (props) {
                  //  route.props = props;
                  route.props = { ...route.props, ...props }
                  route._title = _title || title
                }
              }
            }
            end = true
            paths.push(route)
            return false
          }
        })
        return end
      }
      search(this.routes)
      this.paths = paths.reverse()
    },
    findParentWithRouteName(tree, nameToFind, parent = null) {
      for (const node of tree) {
        if (node.name === nameToFind) {
          return parent;
        }
        if (node.children) {
          const result = this.findParentWithRouteName(node.children, nameToFind, node);
          if (result) {
            return result;
          }
        }
    }
    return null;
   }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .leave-to-class {
    display: none;
  }

  .leftbar{
    min-width:25px;
    width:25px;
    text-align:center;
  }

  .header {
    position: relative;
    // height: 40px;
    line-height: 40px;
    padding: 12px 5px 5px 10px;
    background: #eaedf1;
    margin-bottom: 5px;
  }

  .back{
    left:10px;
    top:10px;
    font-size:20px;
    position:absolute;
    cursor:pointer;
    z-index:100;
    border-raduis:5px;
    padding:3px;
    &:hover{
      background: #f1f1f1;
    }
  }

  .body {
    position:relative;
  }

  .description {
    text-align: right;
    position: absolute;
    right: 10px;
    top: 0px;
    width: 400px;
    /*line-height:14px;*/
  }
</style>
