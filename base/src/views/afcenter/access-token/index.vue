<template>
    <div class="pl-20 pr-20"> 
      <TokenList />
    </div>
</template>

<script>
import TokenList from './TokenList.vue'

export default {
  name: 'access-token',
  components: {
    TokenList,
  },
  data() {
    return {
      tab: 'list',
    }
  },
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
