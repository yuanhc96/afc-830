import { AppController } from '@controller'
import { BaseVue } from "@lib"
export default {
    mixins: [BaseVue],
    data() {
        return{
            isOneApp:false
        }
    },
    computed: {
        queryAppId() {
          return this.$route.query ? this.$route.query.appId : null
        }
    },
    methods: {
        async getAppbyId(id) {
            const resp = await this.dispatch(AppController.findApp, { id: id })
            if (!resp.error) {
              return resp.data
            }
          },
        async findApp() {
        if (this.queryAppId) {
            // 应用菜单下
            const app = await this.getAppbyId(this.queryAppId)
            return { ...app, tab: 'app' }
        } else {
            // 单机版
            const payload = {
            tenantId: this.currentTenant,
            pageSize: -1,
            pageIndex: 0
            }
            const resp = await this.dispatch(
            AppController.queryAppsByCriteria,
            payload
            )
            if (!resp.error) {
            return { ...resp.data.data[0], tab: 'app' }
            }
        }
        }

    }

}
