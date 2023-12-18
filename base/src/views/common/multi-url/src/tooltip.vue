<template>
  <el-tooltip placement="right">
    <div slot="content" style="width: 280px;font-size:14px;">
      <el-row>
        <el-col :span="4">
          格式
        </el-col>
        <el-col :span="20">
          <div class="mb-5">精确. 192.168.0.1</div>
          <div class="mb-5">模糊. 192.168.* (末位星号)</div>
          <div>范围. 192.168.0.1 - 192.168.0.255</div>
        </el-col>
      </el-row>
    </div>
    <i class="el-icon-info" />
  </el-tooltip>
</template>
