<template>
  <div></div>
</template>

<script>
import { getUrlParam } from "@/utils/tools.js";
import { AjaxUtil, _ } from "@lib";
import { removeOriginUrl, getOriginUrl } from '@/utils/auth'
export default {
  name: "sso-login",
  props: {
    url: '',
  },
  data() {
    return {
      errorMessage: "",
      error: "",
    };
  },
  async created() {
    const ticket = getUrlParam("ticket");
    const { origin } = window.location;
    if (ticket) {
      AjaxUtil
        .ajax({
          url: `/api/afc/login/validation-sso-cas?ticket=${ticket}&service=${encodeURIComponent(`${origin}/#/login`)}`,
          method: "get",
        })
        .then((res) => {
          this.$store.dispatch('LoginByUsername', {
                ...res.data,
                code: res.data.userName,
              })
              .then(() => {
                const redirect = getUrlParam("redirect")
                const url = getOriginUrl() || './index.html'
                removeOriginUrl()
                window.location.href = redirect && decodeURIComponent(redirect) || url
              })
        })
        .catch((resp) => {
          this.error = "SSO 登录异常!";
          this.errorMessage = _.get(resp, "response.data.error", "");
          const url = `${this.url}?service=${encodeURIComponent(`${origin}/#/login`)}&appId=${encodeURIComponent(`${origin}/`)}`;
          window.location.href = url;
        });
    } else {
      if (this.url) {
        const url = `${this.url}?service=${encodeURIComponent(`${origin}/#/login`)}&appId=${encodeURIComponent(`${origin}/`)}`;
        window.location.href = url;
      }
    }
  },
};
</script>