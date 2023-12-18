<template>
  <el-tabs class="pl-10 pr-10">
    <el-tab-pane label="基本设置">
      <div class="pr-10 pt-10">
        <el-form :ref="formRef" class="classify-form" :model="form" label-width="150px">
          <el-row :gutter="20">
            <!--        <el-col :span="24">-->
            <!--            <div class="divide-bar"> <span>基本设置</span></div>-->
            <!--        </el-col>-->
            <el-col :span="22">
              <el-form-item label="是否启用">
<!--                <el-switch v-model="form.isEnable" />-->
                <el-radio-group v-model="form.isEnable">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="宽度(px)" prop="waterMarkWidth">
                <el-input v-model.trim="form.waterMarkWidth" type="number" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="高度(px)" prop="waterMarkHeight">
                <el-input v-model.trim="form.waterMarkHeight" type="number" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="旋转角度(逆时针)" prop="rotationAngle">
                <el-slider v-model="form.rotationAngle" style="width:500px" :min="1" :max="360" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="不透明度(百分比)" prop="opaticy">
                <el-slider v-model="form.opaticy" style="width:500px;" />
              </el-form-item>
            </el-col>
            <!--          <el-col :span="24">-->
            <!--            <div class="divide-bar"><span>内容设置</span></div>-->
            <!--        </el-col>-->
            <el-col :span="22">
              <el-form-item label="内容设置">
                <ContentEdit style="margin-left: -30px" :content-text.sync="contentText" @submitUrl="submitUrl" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="div-near-bottom">
          <el-button v-if="formType=='add'" v-permission="FuncCode.afc_f_watermark_add" type="primary" :loading="btnLoading" @click="submit">保存</el-button>
          <el-button v-if="formType=='edit'" v-permission="FuncCode.afc_f_watermark_edit" type="primary" :loading="btnLoading" @click="submit">保存</el-button>
        </div>
      </div>

    </el-tab-pane>
    <el-tab-pane label="白名单">
      <UserList />
    </el-tab-pane>

  </el-tabs>

</template>
<script>
import { localStore } from '@/utils/sessionStore'
import { dealWaterMark } from '@/utils/watermark'
import { WaterMarkController } from '@controller'
import { BaseVue, Form } from '@lib'
import ContentEdit from './contentEdit.vue'
import UserList from './userlist.vue'

export default {
  components: { UserList, ContentEdit },
  mixins: [BaseVue, Form],
  props: {
    data: {},
    params: {},
    group: {
      type: Object,
      default: '默认显示的信息',
    },
    type: {
      default: 'group',
    },
  },
  data() {
    return {
      form: {
        isEnable: false,
        content: null,
        opaticy: 50,
        rotationAngle: 30,
        tenantId: this.currentTenant,
        waterMarkWidth: 200,
        waterMarkHeight: 200
      },
      formRef: 'form',
      formType: null,
      btnLoading: false,
      selectValue: null,
      butdialogVisible: false,
      contentText: '',
    }
  },
  // mounted() {
  //  this.loadData()
  // },
  watch: {},
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const payload = {}
      const resp = await this.dispatch(WaterMarkController.findWaterMark, payload)
      if (!resp.error) {
        if (resp.data.id) {
          this.formType = 'edit'
          const data = resp.data
          data.rotationAngle = Number(data.rotationAngle)
          data.opaticy = Number(data.opaticy)
          this.form = data
          this.contentText = data.content
          if (data.isEnable === 'true') {
            data.isEnable = true
          } else {
            data.isEnable = false
          }
        } else {
          this.formType = 'add'
        }
      }
    },
    async validateResolve() {
      this.form.content = this.contentText
      let resp = {}
      this.btnLoading = true
      let isEnable = null
      if (this.form.isEnable == true) {
        isEnable = 'true'
      } else {
        isEnable = 'false'
      }
      if (this.formType === 'add') {
        this.form.tenantId = this.currentTenant
        const waterMark = { ...this.form, isEnable: isEnable }
        resp = await this.dispatch(WaterMarkController.create, {
          payload: {
            waterMark: waterMark
          }
        })
        this.loadData()
      } else if (this.formType === 'edit') {
        const waterMark = { ...this.form, isEnable: isEnable }
        resp = await this.dispatch(WaterMarkController.update, {
          payload: {
            waterMark: waterMark
          }
        })
      }
      if (!resp.error) {
        this.$msg.success('保存成功!')
        this.$emit('success')
        this.btnLoading = false
        this.UpdateStorewm()
        return true
      } else {
        this.btnLoading = false
        return false
      }
    },

    async UpdateStorewm() {
      const payload = {}
      const res = await this.dispatch(WaterMarkController.findWaterMark, payload)
      if (!res.error) {
        localStore.set('watermark', res.data)
        dealWaterMark()
      }
      // console.log(this.form,'this.form')
      //   localStore.set('watermark',this.form)
      //   dealWaterMark()
    },

    submitUrl(data) {
      this.contentText = data
    },
    toPreview() {
      const routeUrl = this.$router.resolve({
        path: '/preview',
        query: { ...this.form }
      })
      window.open(routeUrl.href, '_blank')
    },

  },
}
</script>
<style lang="scss" >
.markInpute {
  width: 400px;
  height: 10px;
}
.submit {
  margin-left: 280px;
}

</style>
