<template>
  <div>
    <pm-table height="calc(100vh - 350px)" :columns="columns" border stripe :table-data="gridList">
      <template slot="action" slot-scope="{ row }">
          <el-link size="mini" type="text" @click="remove(row)"
            >删除</el-link
          >&nbsp;
          <el-link size="mini" type="text" @click="download(row)"
            >下载</el-link
          >
      </template>
    </pm-table>
    <Pagination
      :selections="selections"
      :page-size="query.limit"
      :current-page.sync="query.offset"
      :total="gridTotal"
      @size-change="changePageSizer"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import { List, BaseVue } from "@lib";
import { OrgController, AttachmentController } from "@controller";
import FileSaver from "file-saver";
import ajaxUtil from "@lib/ajaxUtil";

export default {
  name: "",
  mixins: [List, BaseVue],
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          dimension: {},
          org: {},
        };
      },
    },
    dialogVisible: {
      type: Boolean,
      default: Boolean,
    },
  },
  data() {
    return {
      columns: [
        { label: "名称", prop: "fileName", scope: "" },
        { label: "更新时间", prop: "updateTime", scope: "" },
        { label: "创建人", prop: "createUser", scope: "" },
        { label: "文件大小", prop: "showSize", scope: "" },
        { label: "操作", width: 120, scope: "action" ,align:'left'},
      ],
    };
  },
  watch: {
    dialogVisible: {
      handler(value) {
        if (value) {
          this.search();
        }
      },
      immediate: true,
    },
  },
  computed: {},
  created() {
    // this.search();
  },
  mounted() {},
  methods: {
    async searchBody() {
      const resp = await this.dispatch(OrgController.queryEmpExports, {
        dimensionId: this.data.dimension.id,
        code: this.data.org.type == "root" ? null : this.data.org.code,
        ...this.query,
      });
      if(!resp.error){
        resp.data.data.forEach(item => {
          item.showSize = this.formatFileSize(item.fileSize)
        });
      }
      return resp;
    },
    // 格式化文件大小
    formatFileSize(bytes) {  
      if (bytes < 1024) {  
          return bytes + " bytes";  
      } else if (bytes < 1024 * 1024) {  
          return (bytes / 1024).toFixed(1) + " KB";  
      } else if (bytes < 1024 * 1024 * 1024) {  
          return (bytes / (1024 * 1024)).toFixed(1) + " MB";  
      } else {  
          return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";  
      }  
    },
    removeBody(row) {
      this.dispatch(AttachmentController.removeAttachment, {
        attachmentId: row.fileId,
      }).then((resp) => {
        if (!resp.error) {
          this.search();
          this.$msg.success("删除成功");
        }
      });
    },
    // 下載功能
    async download(row) {
      ajaxUtil.config.responseType = "blob";
      const resp = await this.dispatch(
        AttachmentController.downloadAttachment,
        {
          attachmentId: row.fileId,
        }
      );
      ajaxUtil.config.responseType = "json";
      if (resp.data) {
        const blob = new Blob([resp.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,charset=utf-8",
        });
        FileSaver.saveAs(blob, `${this.data.org.name}员工信息.xlsx`);
      } else {
        this.$msg.error(`系统出错,请确认是否有执行方法的权限`);
      }
    },
  },
};
</script>
<style></style>
