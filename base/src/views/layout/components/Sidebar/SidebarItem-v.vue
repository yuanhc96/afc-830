<template>
  <div class="menu-wrapper">
    <template
      v-for="item in routesWrapper"
      v-if="!item.hidden && item.children"
    >
      <router-link
        v-if="
          hasOneShowingChildren(item.children) &&
          !item.children[0].children &&
          !item.alwaysShow
        "
        :key="item.children[0].name"
        :to="item.path + '/' + item.children[0].path"
      >
        <el-menu-item
          :index="item.path + '/' + item.children[0].path"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <icon
            v-if="item.meta && item.meta.icon"
            :path="item.meta.icon"
          />
          <icon
            v-else-if="item.children[0].meta && item.children[0].meta.icon"
            :path="item.children[0].meta.icon"
          />
          <span
            v-if="item.children[0].meta && item.children[0].meta.title"
            slot="title"
            >{{ generateTitle(item.children[0].meta.title) }}</span
          >
        </el-menu-item>
      </router-link>
      <el-submenu
        v-else
        :key="item.name"
        :index="item.meta.origin + item.path || item.name"
      >
        <template slot="title">
          <icon
            v-if="item.meta && item.meta.icon"
            :path="item.meta.icon"
          />
          <span v-if="item.meta && item.meta.title" slot="title">{{
            generateTitle(item.meta.title)
          }}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            v-if="child.children && child.children.length > 0"
            :key="child.path"
            :is-nest="true"
            class="nest-menu"
            :routes="[child]"
          />

          <router-link
            v-else
            :key="child.name"
            :to="item.path + '/' + child.path"
          >
            <el-menu-item
              style="padding-left: 50px"
              :index="item.path + '/' + child.path"
            >
              <div class="circle" />
              <span v-if="child.meta && child.meta.title" slot="title">{{
                generateTitle(child.meta.title)
              }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { generateTitle } from "@/utils/i18n";
import { BaseVue } from "@lib";
import _ from "lodash";
import Icon from "@/components/Icon/icon";

export default {
  name: "sidebar-item",
  components: { Icon },
  mixins: [BaseVue],
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    isNest: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    routesWrapper() {
      if (this.routes) {
        if (!this.platform) {
          return this.routes;
        } else {
          return this.routes.filter((r) => {
            return (
              !r.group ||
              r.group === this.platform ||
              (_.isArray(r.group) && r.group.some((g) => g === this.platform))
            );
          });
        }
      } else {
        return [];
      }
    },
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter((item) => {
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    generateTitle,
  },
};
</script>
<style lang="scss" scoped>
.el-menu--collapse .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>

