import * as auth from '@/utils/auth.js';
import { localStore } from '@/utils/sessionStore';
import { AttachmentController, MaterialGroupController, SourceMaterialController } from "@controller";
import { BaseVue, HtmlUtil } from "@lib";
import ajaxUtil from '@lib/ajaxUtil';
import moment from 'dayjs';
import FileSaver from 'file-saver';

export default {
  mixins: [BaseVue, HtmlUtil],
  data() {
    let codeTimer = null
    return {
      treeData: [{
        name: '图标',
        id: 'icon',
        code: 'icon'
      },{
        name: '图片',
        id: 'image',
        code: 'image'
      },{
        name: '附件',
        id: 'attachment',
        code: 'file'
      }],
      validateRules: {
        name:[{ required: true, message: "请输入分组名称", trigger: "change" }],
        code:[{ required: true, message: "请输入分组编码", trigger: "change" },{
          validator: (rule, value, callback, source, options) => {
            if (codeTimer !== null) {
              clearTimeout(codeTimer)
            }
            codeTimer = setTimeout(async() => {
              if (!value || this.formType == 'edit') {
                callback()
              } else {
                const count = await this.dispatch(MaterialGroupController.isExistByCode, {
                  code: value,
                  // tenantId: this.currentTenant,
                  materialType: this.typeId
                })
                if (count.data) {
                  callback(new Error(`分组编码已存在!`))
                }
                callback()
              }
            }, 300)
          }}]
      }
    }
  },
  computed: {
    headersParam() {
      // const headers = Authorization: auth.getToken()
      return `?Authorization=${auth.getToken()}`
    },
    apiPrefix() {
      const globalConfig = localStore.get('globalConfig') // 读取全局配置
      return globalConfig.apiPrefix.path === '/' ? '' : globalConfig.apiPrefix.path
    },
  },
  methods: {
    fileUrl(id) {
      return `${this.apiPrefix}/api/lowcode/models/attachments/${id}/actions/download`
    },
    svgUrl(code, iconType, types) {
      return `${this.apiPrefix}/api/afc/materials/font/actions/show?code=${code}&iconType=${iconType}&types=${types}`
    },
    cssLoadUrl(groupCode) {
      return `${this.apiPrefix}/api/afc/materials/font/${groupCode}/iconfont.css`
    },
    async getData(groupId) {
      const resp = await this.dispatch(SourceMaterialController.querySourceMaterialByCriteria, {
        materialGroupId: groupId || this.groupId,
        types: this.typeId
      })
      if (!resp.error) {
        const data = resp.data || []
        if (data.some(file => file.name.endsWith('.json'))) {
          const arr = data.filter(file => file.name.endsWith('.json'))
          this.fileData = arr[0] && arr[0].font_class.map(icon => {
            return {
              name: icon,
              font_class: icon,
              showAction: false
            }
          })
        } else {
          this.$set(this, 'fileData', data)
          // this.fileData = data
        }
      }
    },
    async download(icon) {
      ajaxUtil.config.responseType = 'blob'
      let resp = {}
      if (icon.iconType === 'font') {
        resp =await this.dispatch (SourceMaterialController.downloadFontIcon, {
          materialGroupId: this.groupId
        })
      } else {
        resp = await this.dispatch(AttachmentController.downloadAttachment, {
          attachmentId: icon.fileId
        }) 
      }
      ajaxUtil.config.responseType = 'json'
      if (!resp.error) {
        this.successMessage('下载成功!')
        const attachTypes = icon.iconType === 'font' ? 'zip': icon.iconType === 'svg' ? 'svg' : 'jpg'
        const blob = new Blob([resp.data], {
          type: attachTypes[attachTypes]
        })
        FileSaver.saveAs(blob, `${icon.name}.${attachTypes}`)
      }
    },
    async uploadMethod(obj) {
      this.fileList = []
      const iconType = this.typeId === 'icon' ? (_.endsWith(obj.file.name, '.svg') ? 'svg' : 'font') : 'notIcon'
      // // 校验name是否重复
      const exit = await this.dispatch(SourceMaterialController.isExistByName, {
        iconType,
        materialTypes: this.typeId,
        name: obj.file.name
      })
      if (!exit.error && exit.data) {
        this.$confirm('文件名称重复,请确认是否覆盖?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.upload(obj, iconType, 'cover')
          })
          .catch(() => {
          })
      } else if (!exit.error) {
        this.upload(obj, iconType)
      }
    },
    async upload(obj, iconType, isCover) {
      let params = new FormData()
      params.append('multipartFile', obj.file)
      params.append('types', this.typeId)
      this.groupId && params.append('materialGroupId', this.groupId)
      params.append('isUpdate', 'update')
      params.append('iconType', iconType)
      const resp = await this.dispatch(SourceMaterialController.uploadMaterial, {
        payload: params,
      })
      if (!resp.error) {
        this.successMessage('上传成功!')
        this.getSourceMaterial(iconType, isCover)
      }
    },
    async deleteItem(ids, iconType) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const resp = await this.dispatch(SourceMaterialController.delete, ids)
          if (!resp.error) {
            this.successMessage('删除成功')
            this.getSourceMaterial(iconType)
          }
        })
        .catch(() => {
        })
    },
    async getSourceMaterial(iconType, isCover) {
      if (iconType === 'font') {
        // 刷新分组
        this.getGroups()
        if (isCover === 'cover') {
          await this.getData(this.activeName)
          HtmlUtil.dynamicLoadCss(this.cssLoadUrl(this.currentGroupCode))
        }
      } else if (this.typeId === 'attachment') {
        this.search()
      } else {
        this.getData()
      }
    },
    onCopy(e) {
      this.$msg.success("复制成功！");
    },
    onError(e) {
      this.$msg.error("复制失败！");
    },
    async handleExport(type) {
      console.log(type, '=====type')
      const types = type === 'all' ? null : type
      ajaxUtil.config.responseType = 'blob'
      const resp = await this.dispatch(SourceMaterialController.exportMaterials, {
        isAll: type === 'all',
        types
      })
      ajaxUtil.config.responseType = 'json'
      if (resp.data) {
        const blob = new Blob([resp.data], { type: 'application/zip,charset=utf-8' })
        FileSaver.saveAs(blob, `${moment().format('YYYY-MM-DD')}-素材.zip`)
      }
    },
  }
}