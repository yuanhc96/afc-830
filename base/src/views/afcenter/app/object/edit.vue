<template>
    <div>
        <el-tabs type="card">
            <el-tab-pane label="功能">
                <PmSecondaryMenu :offsetHeight="180" :rightTitle="false">
                    <div slot="left-title">功能分组</div>
                    <div slot="left-body">
                        <el-button class="w-100p mt-5" type="primary" icon="el-icon-plus">新建分组</el-button>
                        <PmTree :data="types">
                            <TreeNode slot="row" slot-scope="{ node, data }" >
                                <template slot="label">
                                    <span>{{ node.label }}</span>
                                </template>
                                <template slot="more">
                                    <el-dropdown size="medium" trigger="click" placement="bottom-start" @command="clickMoreButton">
                                        <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                        </span>
                                        <el-dropdown-menu size="medium" slot="dropdown">
                                        <el-dropdown-item class="ml-10 mr-10" icon="el-icon-delete"
                                            command="removeNode" @click="removeNode"
                                            >删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </TreeNode>
                        </PmTree>
                    </div>
                    <div slot="right-body">
                        <FunctionList/>
                    </div>
                </PmSecondaryMenu>
            </el-tab-pane>
            <el-tab-pane label="URL">
                <PmSecondaryMenu :offsetHeight="180" :rightTitle="false">
                    <div slot="left-title">功能分类</div>
                    <div slot="left-body">
                        <el-button class="w-100p mt-5" type="primary" icon="el-icon-plus">新建分类</el-button>
                        <PmTree :data="types">
                            <TreeNode slot="row" slot-scope="{ node, data }" >
                                <template slot="label">
                                <span>{{ node.label }}</span>
                                </template>
                                <template slot="more">
                                <el-dropdown size="medium" trigger="click" placement="bottom-start" @command="clickMoreButton">
                                    <span class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu size="medium" slot="dropdown">
                                        <el-dropdown-item class="ml-10 mr-10" icon="el-icon-delete"
                                             command="removeNode" @click="removeNode"
                                            >删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </TreeNode>
                        </PmTree>
                    </div>
                    <div slot="right-body">
                        <UrlList v-on="$listeners"/>
                    </div>
                </PmSecondaryMenu>
                
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import FunctionList from '../resource/function-list.vue'
import UrlList from '../resource/url-list.vue'
export default {
    components:{FunctionList, UrlList},
    data() {
        return {
            types:[
                {name:'分类1'},
                {name:'分类2'},
                {name:'分类3'},
                {name:'分类4'},
            ]
        }
    },
}
</script>