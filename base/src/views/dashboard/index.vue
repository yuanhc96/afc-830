<template>
  <div class="dashboard-container"><component :is="currentPlatform" /></div>
</template>

<script>
import { BaseVue } from '@lib'
import AdminDashboard from './home/dashboard.vue'

export default {
  name: 'dashboard',
  components: { AdminDashboard },
  mixins: [BaseVue],
  data() {
    return {
      currentPlatform: 'AdminDashboard',
    }
  },
  created() {
    if (!this.platform || this.platform === 'admin' || this.platform === 'tenant') {
      this.currentPlatform = `AdminDashboard`
    } else if (this.platform === 'tenantAdmin') {
      this.currentPlatform = `TenantDashboard`
    }
  },
}
</script>
