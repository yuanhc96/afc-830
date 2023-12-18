<template>
  <div v-show="menuVisible">
    <div id="pm-context-menu" class="pm-context-menu">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuVisible: false
    }
  },
  methods: {
    close() { // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo)
    },
    show(MouseEvent,) {
      this.menuVisible = true
      const menu = document.querySelector('#pm-context-menu')
      document.addEventListener('click', this.close)
      menu.style.display = 'block'
      menu.style.left = MouseEvent.pageX + 10 + 'px'
      menu.style.top = MouseEvent.pageY + 'px'
    },
  }
}
</script>
<style lang="scss" scoped>
  .pm-context-menu {
    height: inherit;
    position: fixed;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    background: #ffffff;
    z-index: 1000;
    .menu-item {
      list-style: none;
      line-height: 26px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      outline: none;
      &:hover {
        background: #e8e8e8;
      }
    }
  }
</style>
