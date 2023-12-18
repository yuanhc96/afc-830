<template>
  <div class="md_content" v-loading="loading">
    <MarkdownEditor
      class="chat-history-answer"
      :content="markdown"
    />

  </div>
</template>
<script>
import ajaxUtil from '@/libs/ajaxUtil';
import MarkdownEditor from 'markdown-it-vue';
export default {
  name: 'md',
  components: {
    MarkdownEditor,
  },
  mixins: [],
  props: {
  
  },
  data() {
    return {
      markdown: '',
      loading: false
    }
  },
  created() {
    document.title = '说明文档'
  },
  mounted() {
    const { href } = window.location
    const string = href.slice(href.indexOf('?')+ 1)
    const obj = {
      groupCode: string.slice(string.indexOf('groupCode=') + 10, string.indexOf('&')),
      code: string.slice(string.indexOf('code=') + 5)
    }
    this.getData(obj)
  },
  computed: {
    apiPrefix() {
      if(Vue.config.isExpress){
        return `/`
      } else {
        return '/afc/'
      }
    }
  },
  watch: {
  },
  methods: {
    async getData({groupCode, code}) {
      this.loading = true
      const readMd = function readMD(groupCode, code) {
        return ajaxUtil.ajax({
          url: `api/afc/components/${groupCode}/assets/doc/${code}.md`,
          method: 'get'
        })
      }
      readMd(groupCode, code).then(res => {
        this.markdown = res.data.replace(/.\/image/g, `${this.apiPrefix}api/afc/components/${groupCode}/assets/doc/image`)
        this.loading = false
      }).catch(error => {
        this.$msg.error(`${error.data && error.data.errorLocalizedMessage || '获取文档失败!'}`)
        this.loading = false
      })
    }
   
  },
}
</script>
<style lang="scss" scoped>
  .md_content {
    padding: 20px 50px;
  }
</style>