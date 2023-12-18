<script>
import { removeLoginType, removeToken } from '@/utils/auth'
import { localStore } from '@/utils/sessionStore'
import Vue from 'vue'
export default {
    created() {
        this.register401()
    },
    methods:{
        register401(){
            this.$BaseBus.$on('request:401',()=>{
                this.$BaseBus.$off('request:401')
                Vue.prototype.$confirm('登录信息已过期!', '提示', {
                    confirmButtonText: '重新登录',
                    type: 'warning',
                    center: true,
                    showClose: false,
                    showCancelButton: false,
                    closeOnClickModal: false,
                }).then(() => {
                    this.$store.commit('SET_TOKEN', '')
                    this.$store.commit('SET_ROLES', [])
                    this.$store.commit('SET_USER', null)
                    this.$store.commit('SET_PLATFORM', null)
                    this.$store.commit('SET_MENUS', [])
                    this.$store.commit('SET_FUNCTIONS', [])
                    this.$store.commit('SET_ROLES', [])
                    removeToken()
                    removeLoginType()
                    if (Vue.config.login_type === 'sso') {
                        // 如果是单点登录
                        const { origin } = window.location
                        const url = `${Vue.config.ssoLoginUrl}?SSOLOGOUT=true&service=${encodeURIComponent(`${origin}/#/login`)}&appId=${encodeURIComponent(`${origin}/`)}`
                        window.location.href = url
                    } else {
                        location.reload();
                    }
                    // window.location.href = Vue.config.logoutTo || './index.html'
                    localStore.set('isobjectMenu', false)
                    localStore.set('watermark', null)
                })
            })
        }
    }
}
</script>