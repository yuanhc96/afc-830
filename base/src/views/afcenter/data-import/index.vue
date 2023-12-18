<template>
  <div>
    <div class="wea-new-top-content" style="height: 543.458px">
      <div class="hrm-import-wrap">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="hrm-card-out"
          style="margin-left: 0px"
          @mouseenter="enters(item.index)"
          @mouseleave="leaver(item.index)"
        >
          <div
            class="hrm-card-inwrap"
            :style="switchNice[item.index].dataShow ? item.style : cardStyle"
          >
            <div v-show="switchNice[item.index].dataShow">
              <div class="hrm-card-icon">
                <span>
                  <i :class="item.iconClass"></i>
                </span>
              </div>
              <div class="hrm-card-title" style="">{{ item.name }}</div>
            </div>
            <div v-show="switchNice[item.index].importShow">
              <div class="hrm-import">
                <a @click="importSetting(item)">{{
                  importList[item.index].import
                }}</a>
              </div>
              <div class="hrm-linkto">
                <a @click="toLink(item.index)">{{
                  importList[item.index].link
                }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ImportForm
      v-if="importDialogVisible"
      :dialog-visible.sync="importDialogVisible"
      :importSettingVisible="importSettingVisible"
      :repeatSettingVisible="repeatSettingVisible"
      :DimensionsVisible="DimensionsVisible"
      :downloadTemplateSetting="downloadTemplateSetting"
      :introductionList="introductionList"
      :importTitle="name"
      :currentIndex="currentIndex"
    />
    <SyncResourceForm
      v-if="SyncResourceVisible"
      :dialog-visible.sync="SyncResourceVisible"
    />
  </div>
</template>
<script>
import ImportForm from "./import.vue"
import SyncResourceForm from './sync-resources.vue'
export default {
  components: { ImportForm, SyncResourceForm },
  data() {
    return {
      importDialogVisible: false,
      repeatSettingVisible: false,
      importSettingVisible: false,
      DimensionsVisible:false,
      SyncResourceVisible: false,
      downloadTemplateSetting: "",
      introductionList: [],
      name:"",
      currentIndex: 0,
      cardStyle: {
        backgroundColor: "rgb(133, 133, 133)",
      },
      dataList: [
        {
          index: 0,
          id: "org",
          name: "组织机构",
          iconClass: "el-icon-s-operation",
          style: {
            backgroundColor: "rgb(81, 163, 154)",
          },
          importSettingVisible: true,
          repeatSettingVisible: false,
          DimensionsVisible: true,
          uploadUrl: "org-uploadUrl",
           downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/orgs/export-model",
            templateName:'OrganizationTemplate'
          },
          introductionList: ["选择维度;默认维度为行政", "选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致","部门和下级部门层级关系必须用字符 > 分割；","部门编号和下级部门层级关系必须用字符 > 分割；","部门数据必须填入导入模板的第2个sheet中，导入模板中第1行为固定行，不能填写数据，数据从第2行开始填写，中间不能有空行。"],
          path:'/org'
        },
        {
          index: 1,
          id: "employee",
          name: "人员",
          iconClass: "el-icon-user",
          style: {
            backgroundColor: "rgb(73, 178, 254)",
          },
          importSettingVisible: true,
          repeatSettingVisible: true,
          DimensionsVisible: true,
          uploadUrl: "employee-uploadUrl",
          downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/orgs/emp-export-model",
            templateName:'EmployeeTemplate'
          },
          introductionList: ["选择维度;默认维度为行政", "选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致","人员数据必须填入导入模板的第2个sheet中，导入模板中第1行为固定行，不能填写人员数据，数据从第2行开始填写，中间不能有空行。","导入模板中，部门和编号的列位置不能改变，员工编号、姓名、登录账号、密码为必填列，其它为非必填列，非必填列可不填或删除,同时确保excel模板中列名不重复。","部门的层级关系用字符 > 分割，同属一个分部和部门的可以只写第一行，但是禁止排序。","重复验证字段说明：判断Excel数据中的数据是否在系统中存在，如果系统中已存在，则根据导入类型判断更新或忽略。","导入类型说明：判断是更新或忽略或者失败，根据重复验证字段，对重复数据的处理策略；更新指更新重复的数据，忽略指不对重复的数据处理；失败指如果有数据重复，导入失败；","导入为人员导入，部门信息、岗位信息必须为系统已有信息，如果不存在，导入会失败；","登录密码为非加密密码，如密码为000000，则表格中密码填写为000000；"],
          path:'/org'
        },
        {
          index: 2,
          id: "res",
          name: "资源",
          iconClass: "el-icon-menu",
          style: {
            backgroundColor: "rgb(230, 168, 69)",
          },
          importSettingVisible: true,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          uploadUrl: "/api/function-code-tools/${this.uploadData.importSetting}/import-app-resource",
          downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/function-code-tools/download-resource-template",
            templateName:'ResoueseTemplate'
          },
          introductionList: ["选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致", "导入类型说明：判断是修改或忽略，如果是修改，重复的列值在库中会被修改；如果是忽略，重复的列值则不做操作。", "导入数据从第二个sheet页开始填写，导入模板中第一个行为固定行，不可填写数据；从第二行开始填写数据，中间不能有空行。", "资源","导入模板中，表头带*号为必填列，其他为非必填列。","重复验证字段说明：判断Excel数据中的数据是否在系统中存在，如果系统中已存在，则根据导入类型判断更新或忽略。","业务对象、分组信息两个sheet页中应用编码必须为系统已有信息，或应用信息sheet页已存在应用编码。","资源信息sheet页中应用编码字段、资源分组字段、业务对象编码字段为系统已存在信息，或应用信息、业务对象、资源分组sheet页中已存在编码。"],
          path:'/app'
          
        },
        {
          index: 3,
          id: "dict",
          name: "业务字典",
          iconClass: "el-icon-s-data",
          style: {
            backgroundColor: "rgb(146, 183, 91)",
          },
          importSettingVisible: true,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          uploadUrl: "dict-uploadUrl",
          downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/dict-types/download-dict-template",
            templateName:'DictionaryTemplate'
          },
          introductionList: ["选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致", "导入类型说明：判断是修改或忽略，如果是修改，重复的列值在库中会被修改；如果是忽略，重复的列值则不做操作。", "导入数据从第二个sheet页开始填写，导入模板中第一个行为固定行，不可填写数据；从第二行开始填写数据，中间不能有空行。","导入模板中，表头带*号为必填列，其他为非必填列。","重复验证字段说明：判断Excel数据中的数据是否在系统中存在，如果系统中已存在，则根据导入类型判断更新或忽略。","字典类型信息sheet页中上级字典类型编码必须为系统已有信息，或字典类型信息sheet页已存在字典类型编码。","字典项信息sheet页中字典类型编码必须为系统已有信息，或字典类型sheet页中已存在编码。","字典项信息sheet页中上级字典项编码必须为系统已有信息，或字典项信息sheet页已存在字典项编码。"],
          path:'/dict'
        },
        {
          index: 4,
          id: "source",
          name: "同步租户资源",
          iconClass: "el-icon-setting",
          style: {
            backgroundColor: "rgb(226 145 89)",
          },
          importSettingVisible: false,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          syncResourceVisible: true,
          uploadUrl: "/api/function-code-tools/${this.uploadData.importSetting}/import-app-resource",
          downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/function-code-tools/download-resource-template",
            templateName:'ResoueseTemplate'
          },
          introductionList: ["选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致", "导入类型说明：判断是修改或忽略，如果是修改，重复的列值在库中会被修改；如果是忽略，重复的列值则不做操作。", "导入数据从第二个sheet页开始填写，导入模板中第一个行为固定行，不可填写数据；从第二行开始填写数据，中间不能有空行。", "资源","导入模板中，表头带*号为必填列，其他为非必填列。","重复验证字段说明：判断Excel数据中的数据是否在系统中存在，如果系统中已存在，则根据导入类型判断更新或忽略。","业务对象、分组信息两个sheet页中应用编码必须为系统已有信息，或应用信息sheet页已存在应用编码。","资源信息sheet页中应用编码字段、资源分组字段、业务对象编码字段为系统已存在信息，或应用信息、业务对象、资源分组sheet页中已存在编码。"],
          // path:'/app'
          
        },
        {
          index: 5,
          id: "i18n",
          name: "国际化语言",
          iconClass: "el-icon-postcard",
          style: {
            backgroundColor: "rgb(129 106 160)",
          },
          importSettingVisible: true,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          uploadUrl: "i8n-uploadUrl",
          downloadTemplateSetting:{
            downloadTemplateUrl: "/api/afc/i18ns/actions/download-i18n-template",
            templateName:'i18nTemplate'
          },
          introductionList: ["选择导入模式；默认重复校验字段为code", "下载模板","使用导入模板版本必须与当前系统支持模板版本一致","导入模板中，表头带*号为必填列，其他为非必填列。","重复验证字段说明：判断Excel数据中的数据是否在系统中存在，如果系统中已存在，则根据导入类型判断更新或忽略。","国际化属性：目前版本国际化只支持Menu、DictType、DictEntry的name属性做国际化配置，因此对应做name属性的国际化翻译即可","可扩展国际化语言支持：模板只列出了en_US,用户可自行在最后一列添加国际化编码和对应国际化值","第三列：所属字典类型编码，如果类型为Menu和DictType，这一项无需填写"],
          path:'/dict'
        },
        {
          index: 6,
          id: "material",
          name: "素材库",
          iconClass: "el-icon-document-add",
          style: {
            backgroundColor: "rgb(91 163 183)",
          },
          importSettingVisible: true,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          uploadUrl: "/api/afc/materials/actions/import/${this.uploadData.importSetting}",
          downloadTemplateSetting:{
            // downloadTemplateUrl: "/api/afc/dict-types/download-dict-template",
            // templateName:'DictionaryTemplate'
          },
          introductionList: ["导入的zip包必须为导出的素材zip包"],
          path:'/source_store'
        },{
          index: 7,
          id: "components",
          name: "组件库",
          iconClass: "el-icon-files",
          style: {
            backgroundColor: "rgb(183 157 91)",
          },
          importSettingVisible: false,
          repeatSettingVisible: false,
          DimensionsVisible: false,
          uploadUrl: "/api/afc/component-centers/actions/import",
          downloadTemplateSetting:{
            // downloadTemplateUrl: "/api/afc/dict-types/download-dict-template",
            // templateName:'DictionaryTemplate'
          },
          introductionList: ["导入的zip包必须为 <导出全部组件> 的zip包"],
          path:'/components_store'
        }
      ],
      importList: [
        {
          id: "org",
          link: "组织管理",
          import: "组织导入",
        },
        {
          id: "employee",
          link: "人员管理",
          import: "人员导入",
        },
        {
          id: "res",
          link: "资源管理",
          import: "资源导入",
        },
        {
          id: "dict",
          link: "业务字典管理",
          import: "业务字典导入",
        },
        {
          id: "source",
          // link: "素材管理",
          import: "同步租户资源",
        },
        {
          id: "i18n",
          import: "国际化语言资源",
        },
        {
          id: "material",
          link: "素材库",
          import: "素材库导入"
        },
        {
          id: "components",
          link: "组件库",
          import: "组件库导入"
        }
      ],
      switchNice: [
        //这绑定了上面V-show,
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        },
        {
          dataShow: true,
          importShow: false,
        }
      ],
    };
  },
  watch: {},
  mounted() {},
  computed: {},
  methods: {
    importSetting(item) {
      Object.assign(this.$data,this.dataList[this.currentIndex])
      if (item.id === 'source') {
        this.SyncResourceVisible = true
      } else {
        this.importDialogVisible = true;
      }
    },
    enters(index) {
      this.currentIndex = index;
      this.switchNice[index].dataShow = false; 
      this.switchNice[index].importShow = true; 
    },
    leaver(index) {
      this.switchNice[index].dataShow = true; 
      this.switchNice[index].importShow = false;
    },
    toLink(index){
      const {path} = this.dataList[index];
      const urlpath = this.$router.resolve({
        path: path,
      })
      window.open(urlpath.href, '_blank')
    }
  },
};
</script>
<style lang="scss" scoped>
.hrm-card-out {
  width: 24%;
  height: 130px;
  float: left;
  margin: 10px;
  margin-left: 1.3%;
  margin-top: 10px;
}

.hrm-card-inwrap {
  height: 100%;
  position: relative;
  cursor: pointer;
  border-radius:8px;
}

.hrm-card-icon {
  width: 40px;
  font-size: 40px;
  position: absolute;
  left: 50%;
  margin-left: -20px;
  margin-top: 30px;
  color: #fff;
}
.hrm-linkto {
  height: 35px;
  text-align: right;
  font-size: 14px;
  padding-right: 10px;
  background-color: rgb(165, 161, 161);
  color: rgb(255, 255, 255);
  padding-top: 10px;
  text-decoration: underline;
}
.hrm-import {
  width: 100%;
  height: 95px;
  color: rgb(255, 255, 255);
  line-height: 95px; /*设置line-height与父级元素的height相等*/
  font-size: 17px;
  text-align: center; /*设置文本水平居中*/
  overflow: hidden; /*防止内容超出容器或者产生自动换行*/
  text-decoration: underline;
}
.hrm-card-title {
  /*width: 80px;*/
  text-align: right;
  position: absolute;
  right: 20px;
  font-size: 17px;
  bottom: 15px;
  color: #fff;
}

.hrm-import-wrap {
  width: 90%;
  height: 100%;
  margin-left: 20px;
  padding-top: 10px;
}

.hrm-import-table-th .ant-table-tbody > tr > td,
.ant-table-thead > tr > th {
  padding: 8px 8px;
  color: #666;
}

.hrm-import-table-th .ant-table-thead > tr > th {
  background-color: #f0f6f6;
}

.hrm-import-table-th .ant-table {
  border-radius: 0;
}

.hrm-import-table-th .ant-table table {
  border-radius: 0;
}

.hrm-import-loading .ant-spin.ant-spin-show-text .ant-spin-text {
  float: right;
  margin-left: 20px;
  padding-top: 2px;
}

.hrm-import-error-tip {
  width: 30px;
  height: 30px;
  border-radius: 25px;
  padding: 6px;
  margin-left: 230px;
  margin-right: 10px;
  display: inline-block;
  background-color: rgb(255, 0, 0);
}

.hrm-import-ant-table .ant-table-tbody > tr > td,
.ant-table-thead > tr > th {
  padding: 8px 8px;
}

.hrm-import-link {
  color: #b4b4b4;
}

.hrm-import-link:hover {
  color: #fff;
}
</style>