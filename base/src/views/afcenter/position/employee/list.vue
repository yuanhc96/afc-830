<template>
  <div id="user-manage">
    <PmDownload v-model="url" />
    <div v-if="true" class="top-block  mt-10">
      <el-form class="view-form classify-form" label-width="90px" :inline="true">
        <el-form-item label="姓名">
          <el-input v-model.trim="query.empname" clearable />
        </el-form-item>
        <el-form-item label-width="0px">
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div>
      <PmToolbar>
        <PmToolbarItem icon="el-icon-plus" @click="action('add')"
          >新建</PmToolbarItem
        >
        <PmToolbarItem
          type="primary"
          icon="el-icon-delete"
          @click="info('delete')"
          >删除</PmToolbarItem
        >
        <PmToolbarItem
          type="primary"
          icon="el-icon-download"
          @click="info('delete')"
          >导入</PmToolbarItem
        >
        <PmToolbarItem type="primary" icon="el-icon-upload" @click="download()"
          >导出</PmToolbarItem
        >
      </PmToolbar>
    </div>
    <!-- <PmToolbarItem type="primary" icon="el-icon-search" @click="info('search')"
      >查询</PmToolbarItem
    >
    <PmToolbarItem type="primary" icon="el-icon-refresh" @click="info('reset')"
      >重置</PmToolbarItem
    > -->
    <pm-table
      height="calc(100vh - 290px)"
      :columns="columns"
      border
      checked
      :tableData="this.gridData.data"
    >
      <div class="inline-action" slot="action" slot-scope="scope">
        <PmToolbarItem type="text" @click="showDetail(scope.row)" round
          >员工管理</PmToolbarItem
        >
        <PmToolbarItem type="text" @click="showDetail(scope.row)" round
          >授权</PmToolbarItem
        >
        <PmToolbarItem type="text" @click="showDetail(scope.row)" round
          >权限列表</PmToolbarItem
        >
        <PmToolbarItem type="text" @click="showDetail(scope.row)" round
          >编辑</PmToolbarItem
        >
      </div>
    </pm-table>
        <Pagination
          :selections="selections"
          :page-size="query.limit"
          :current-page.sync="query.offset"
          :total="gridTotal"
          @size-change="changePageSizer"
          @current-change="changePage"
        />
    <PmFormDialog
      :title="actionTitle + '用户'"
      ok-text="确定"
      :dialog-visible.sync="actionVisible"
      width="800px"
      ><div slot="form">
        <el-transfer v-model="value" :data="data1"></el-transfer>
      </div>
    </PmFormDialog>
  </div>
</template>

<script>
import { BaseVue, List } from "@lib";
import {PositionController} from '@controller';
export default {
  mixins: [BaseVue, List],
  name: "employee", // 和菜单代码一致即可开启页面缓存
  data() {
    const generateData = (_) => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0,
        });
      }
      return data;
    };
    return {
      data1: generateData(),
      value: [1, 4],
      data: [
        {
          name: "zzr",
        },
      ],
      addAttrs: {
        name: "zzr",
      },
      model: {},
      tableData: [ ],
      columns: [
        { label: "姓名", prop: "name", scope: "name" },
        { label: "性别", prop: "age" },
        { label: "状态", prop: "status" },
        { label: "个人邮箱", prop: "pemail" },
        { label: "证件编码", prop: "cardNumber" },
        { label: "手机号码", prop: "phoneNumber" },
        { label: "办公室地址", prop: "oaddress" },
        { label: "操作", scope: "action" },
      ],
      formVisible: false,
      actionVisible: false,
      actionTitle: "",
      url: "",
    };
  },
  created() {},
  methods: {
    //下载
    download() {
      this.url =
        "https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original";
    },
    // 提示
    info(text) {
       this.$msg.info(text)
    },
    // 
    async searchBody(){
      const resp = this.dispatch(PositionController.queryPositionsByCriteria,{
        ...this.query
      })
      if(!resp.error){
        return resp
      }
    },
    // 跳转到权限页面
    showDetail(row) {
      this.$router.push("/menu_auth/menu_auth"); //row
      console.log(row);
      // this.formVisible = true;
    },
    // 操作区功能
    action(type) {
      this.actionVisible = true;
      if (type === "add") {
        this.actionTitle = "添加";
      } else {
        this.actionTitle = "编辑";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#user-manage {
  .search-field {
    width: 200px;
  }
  ::v-deep .inline-action {
    .el-button--text {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
}
</style>
