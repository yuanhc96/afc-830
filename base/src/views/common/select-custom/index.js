import Vue from 'vue'
import SelectDict from './src/dict.vue'
import SelectStaticDict from './src/static-dict.vue'
import SelectTable from './src/table.vue'
import SelectText from './src/text.vue'
import SelectTextDict from './src/text-dict.vue'
import SelectDynamic from './src/dynamic.vue'
import SelectEnvType from './src/env-type.vue'
Vue.component('SelectDict', SelectDict)
Vue.component('SelectStaticDict', SelectStaticDict)
Vue.component('SelectTextDict', SelectTextDict)
Vue.component('SelectDynamic', SelectDynamic)
Vue.component('SelectText', SelectText)
Vue.component('SelectTable', SelectTable)
Vue.component('SelectEnvType', SelectEnvType)
