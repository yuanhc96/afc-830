<template>
  <div class="text-center mt-50">
    <div v-if="error">
      <div class="error f-20">{{ error }}</div>
      <div class="mt-10"><a class="blue f-14" href="/#login">重新登录</a></div>
      <div class="mt-20">{{ errorMessage }}</div>
    </div>
    <div v-else class="f-20"><i class="el-icon-loading" />登录跳转中...</div>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth.js'
import { AjaxUtil, _ } from '@lib'

export default {
  name: 'iam-login',
  props: {
    url: {},
  },
  data() {
    return {
      loginUrl: null,
      errorMessage: '',
      error: '',
    }
  },
  async created() {
    let query = window.location.search
    if (query) {
      const num = query.lastIndexOf('&')
      query = query.slice(num + 1)
      const headers = AjaxUtil.buildHeaders()
      AjaxUtil
        .headers({
          ...headers,
          'getToken': 'true',
        })
        .ajax({
          url: `/api/client/validate-st${query}`,
          method: 'get',
        }).then((resp) => {
          setToken(resp.data.token)
          this.$router.push({ name: 'dashboard' })
          //          window.location.href = '/#dashboard'
        }).catch((resp) => {
          this.error = 'IAM 登录异常!'
          this.errorMessage = _.get(resp, 'response.data.error', '')
        })
    } else {
      if (this.url) {
        window.location.href = this.url
      }
    }
  }
}
</script>
