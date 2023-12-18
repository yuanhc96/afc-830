<template>
    <el-row :gutter="10">
        <el-col :span="11">
            <div class="selectUser_search">
                <el-row type="flex">
                    <el-col style="width:150px">
                        <slot name="filter"></slot>
                    </el-col>
                    <el-col>
                        <PmSearch
                                ref="searchForm"
                                :placeholder="'搜索' + searchLabel"
                                :query.sync="queryOrg"
                                defaultProp="name"
                                @search="getData"
                        >
                            <template v-if="type!=='user'" slot="body">
                                <el-form-item :label="searchLabel" prop="name">
                                    <el-input
                                            v-model.trim="queryOrg.name"
                                            clearable
                                            @keypress.native.enter="searchEnter"
                                    />
                                </el-form-item>
                                <el-form-item :label="dictType[this.activeName] + '编号'" prop="code">
                                    <el-input
                                            v-model.trim="queryOrg.code"
                                            clearable
                                            @keypress.native.enter="searchEnter"
                                    />
                                </el-form-item>
                            </template>
                            <template v-else slot="body">
                                <el-form-item label="账号编号" prop="code">
                                    <el-input
                                            v-model.trim="queryOrg.code"
                                            clearable
                                            @keypress.native.enter="searchEnter"
                                    />
                                </el-form-item>
                                <el-form-item label="员工姓名" prop="name">
                                    <el-input
                                            v-model.trim="queryOrg.name"
                                            clearable
                                            @keypress.native.enter="searchEnter"
                                    />
                                </el-form-item>
                            </template>
                        </PmSearch>
                    </el-col>
                </el-row>
            </div>
            <div v-if="showTreeOrg" class="block">
                <div v-if="activeName !== 'org' && activeName !== 'workGroup'">
                    <!-- 面包屑导航 -->
                    <div class="top-area">
                        <div class="scroll-bar">
                            <el-breadcrumb separator-class="el-icon-arrow-right"
                                           style="white-space: nowrap; display: flex;">
                                <el-breadcrumb-item
                                        v-for="(item, index) in breadcrumbList"
                                        :key="index"
                                        @click.native="changeList(item)"
                                >
                                    {{ item ? item.name : '' }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <!-- <el-button @click="allCheck" type="primary">全选</el-button> -->
                    </div>
                    <!-- 人员列表 -->
                    <el-table
                            ref="multipleTable"
                            :data="breadModeData"
                            :show-header="false"
                            @select="selectionChange">
                        <el-table-column prop="name" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <div style="display: flex;align-items: center">
                                    <el-checkbox v-if="row.type !== 'org' && row.type !== 'position'" v-model="row.checked"
                                                 @change="changeList(row)"></el-checkbox>
                                    <i v-else class="el-icon-caret-right" style="cursor: pointer"
                                       @click="changeList(row)"></i>
                                    <!--                          <img :src="imgUrl[row.type]" style="margin-left: 5px" alt="">-->
                                    <div style="cursor: pointer;margin-left: 5px" @click="changeList(row)"
                                    >
                                        {{
                                        row.name + (row.code && row.type !== 'position' ? ' ( ' + row.code + ' )' : '')
                                        }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            v-show="breadcrumbList.length > 1 && type === 'position'"
                            hide-on-single-page
                            :current-page.sync="breadCurrent"
                            :page-size="20"
                            :total="breadTotal"
                            background
                            class="pagination"
                            layout="total,prev, pager,next"
                            @current-change="changeBreadPage"
                    >
                    </el-pagination>
                </div>
                <el-tree
                    v-else
                    ref="treeLeft"
                    v-loading="loading"
                    :check-strictly="
            type === 'org' || isMultiple == false
          "
                    :load="loadNode"
                    :props="defaultProps"
                    lazy
                    node-key="id"
                    show-checkbox
                    @check-change="handleCheckChangeLeft"
                >
                    <div
                        v-if="type === 'user' || type === 'emp' || type === 'org'"
                        slot-scope="{ node, data }"
                        style="width: 85%"
                    >
                        <template v-if="data.type === 'org' || type === 'org'">
                            <!-- <i class="iconfont icon-inquiry-template" /> -->
                            <svg-icon class="svgicon" icon-class="org-tree"/>
                            <span :title="data.name" class="one_warp">{{ data.name }}</span>
                        </template>
                        <template v-else>
                            <i class="el-icon-user"></i>
                            <span :title="handleName(data)" class="one_warp">{{ handleName(data) }}</span>
                        </template>
                    </div>
                    <div
                        v-else-if="type === 'position'"
                        slot-scope="{ node, data }"
                        style="width: 85%"
                    >
                        <template v-if="data.type === 'position'">
                            <i class="iconfont icon-inquiry-template"/>
                            <span :title="data.name" class="one_warp">{{ data.name }}</span>
                        </template>
                        <template v-else>
                            <i class="el-icon-user"></i>
                            <span :title="handleName(data)" class="one_warp">{{ handleName(data) }}</span>
                        </template>
                    </div>
                    <div v-else slot-scope="{ node, data }" style="width: 85%">
                        <i class="iconfont icon-inquiry-template"></i>
                        <span :title="data.name" class="one_warp">{{ data.name }}</span>
                    </div>
                </el-tree>
            </div>
            <div v-else class="block">
                <select-table
                        ref="multipleTable"
                        :height="type != 'org' ? 349 : 399"
                        :loading="selectLoading"
                        :selectedRows.sync="tableDataSelect"
                        :tableData="tableDataOrg"
                        :type="type"
                        @change="selectionChange"
                >
                    <template v-if="type != 'org'" slot="pagination">
                        <el-pagination
                                :current-page.sync="queryOrg.offset"
                                :page-size="queryOrg.limit"
                                :page-sizes="[10, 20, 30, 40, 50]"
                                :total="gridTotal"
                                background
                                class="pagination"
                                layout="total,prev, pager,next, sizes"
                                @size-change="changePageSizer"
                                @current-change="changePage"
                        >
                        </el-pagination>
                    </template>
                </select-table>
            </div>
        </el-col>
        <el-col :span="2">
            <div style="margin-top:170px;">
                <div class="text-center">
                    <el-button
                            v-if="type != 'user' && type != 'emp'"
                            circle
                            icon="el-icon-d-arrow-right"
                            type="primary"
                            @click="addAllUsers"
                    ></el-button>
                </div>
                <div class="text-center">
                    <el-button
                            circle
                            icon="el-icon-d-arrow-left"
                            style="margin-top:15px"
                            type="primary"
                            @click="removeAllUsers"
                    ></el-button>
                </div>
            </div>
        </el-col>
        <el-col :span="11">
            <div class="right_title p-5">
                <span>{{ rightTitle }}</span>
            </div>
            <div class="block" style="border-bottom:none">
                <select-table
                        :showRemove="true"
                        :showSelect="false"
                        :showType="true"
                        :tableData="tableDataSelect"
                        @change="selectionChangeOrg"
                />
            </div>
        </el-col>
    </el-row>
</template>

<script>
import {
    OrgController,
    PositionController,
    SelectionComponentController
} from "@controller";
import {BaseVue, VueUtil} from "@lib";
import SelectTable from "./select-table.vue";

export default {
    name: "member-org",
    components: {SelectTable},
    mixins: [BaseVue],
    props: {
        positionSearch: {},
        value: {},
        title: {
            type: String,
            default: "选择成员",
        },
        isMultiple: {
            type: Boolean,
            default: true,
        },
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
        },
        dictType: {
            type: Object,
            default: {},
        },
        flag: {
            type: Boolean,
            default: true, //是否查询初始化管理员用户和员工 默认是
        },
        allSelecteData: {
            type: Array,
            default: [],
        },
        activeName: {
            type: String,
            default: "user",
        },
    },
    data() {
        return {
            breadcrumbList: [{orgLevel: 0, name: '根节点', type: 'org'}],
            breadModeData: [],
            currentData: {},
            breadTotal: 0,
            breadCurrent: 1,
            rootData: [],
            defaultProps: {
                label: "name",
                children: "children",
                isLeaf: "leaf",
            },
            queryOrg: {
                code: null,
                name: null,
                limit: 10,
                offset: 0,
            },
            tableDataSelect: [], //右边表格
            selectedLeft: [],
            selectedRight: [],
            tableDataOrg: [], //右边表格选中
            selections: [],
            selectionsOrg: [],
            // 机构搜索显示树还是表格
            showTreeOrg: true,
            gridData: {},
        };
    },
    computed: {
        ...VueUtil(this)
            .select([OrgController,
                PositionController,
                SelectionComponentController])
            .state(),
        rightTitle() {
            const isMultiple = " (" + `${this.isMultiple ? "多选" : "单选"}` + ")";
            return "已选" + isMultiple;
        },
        disabledTurnLeftOrg() {
            return !this.selectionsOrg.length;
        },
        selectLoading() {
            if (this.activeName === "org") {
                return this.OrgController.queryOrgsByCriteria.loading;
            } else if (this.activeName === "position") {
                return this.OrgController.queryPositionsToTree.loading;
            } else if (this.activeName === "emp") {
                return this.SelectionComponentController.queryEmployee.loading;
            } else if (this.activeName === "user") {
                return this.SelectionComponentController.queryUser.loading;
            }
        },
        loading() {
            if (this.activeName === "org") {
                return this.SelectionComponentController.queryOrg.loading;
            } else if (this.activeName === "position") {
                return this.PositionController.queryPositionTypes.loading;
            } else if (this.activeName === "emp") {
                return this.SelectionComponentController.queryOrg.loading;
            } else if (this.activeName === "user") {
                return this.SelectionComponentController.queryOrg.loading;
            }
        },
        searchLabel() {
            if (this.activeName === "emp") {
                return this.dictType && this.dictType[this.activeName] + "姓名";
            } else if (this.activeName === "user") {
                return "员工姓名";
            } else {
                return this.dictType && this.dictType[this.activeName] + "名称";
            }
        },
        gridTotal() {
            if (this.gridData && !_.isArray(this.gridData)) {
                return this.gridData.totalElements || this.gridData.total;
            } else return 0;
        },
    },
    watch: {
        tableDataSelect: {
            handler(val) {
                this.breadModeData = this.breadModeData.map(i => {
                    i.checked = val.some(n => i.id === n.id && i.extraType === n.extraType)
                    return i
                })
            }

        },
        activeName: {
            immediate: true,
            handler(val) {
                this.getBreadData()
                this.tableDataSelect = _.cloneDeep(this.allSelecteData);
            },
        },
    },
    mounted() {
        this.getBreadData()
    },
    methods: {
        searchEnter() {
            if (this.$refs.searchForm) {
                //高级搜索 enter
                this.$refs.searchForm.searchQuery = {...this.query};
                this.$refs.searchForm.initOptions();
                this.$refs.searchForm.visible = false;
            }
            this.getData();
        },
        async getBreadData() {
            console.log(this.activeName)
            if (this.activeName === 'position') {
                const resp = await this.dispatch(
                    PositionController.queryPositionTypes,
                );
                this.breadModeData = resp.data.data.map((item) => {
                    item.type = "position";
                    item.disabled = !this.isMultiple;
                    return item;
                });
            } else {
                const resp = await this.dispatch(
                    SelectionComponentController.queryOrg,
                );
                this.breadModeData = resp.data.map((item) => {
                    item.type = "org";
                    item.disabled = true;
                    return item;
                });
            }

        },
        getData() {
            if (this.queryOrg.name || this.queryOrg.code) {
                this.showTreeOrg = false;
            } else {
                this.showTreeOrg = true;
            }
            if (this.activeName === "org") {
                this.getDataOrg();
            } else if (this.activeName === "position") {
                this.getDataPosition();
            } else if (this.activeName === "emp") {
                this.getDataEmp();
            } else if (this.activeName === "user") {
                this.getDataUser();
            }
        },
        async getDataOrg() {
            let payload = {code: this.queryOrg.code, name: this.queryOrg.name};
            const resp = await this.dispatch(
                OrgController.queryOrgsByCriteria,
                payload
            );
            if (!resp.error) {
                this.gridData = resp;
                this.tableDataOrg = resp.data.map(i => {
                    return {
                        ...i,
                        extra: {
                            type: this.activeName,
                            name: this.dictType[this.activeName],
                        },
                        extraType: this.activeName
                    }
                });
                this.tableDataOrg.forEach((row, index) => {
                    this.tableDataSelect.forEach((item) => {
                        if (this.isSame(row, item) && row.id === item.id) {
                            this.toggleRowSelection(row);
                        }
                    });
                });
            }
        },
        toggleRowSelection(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        async getDataPosition() {
            if (this.queryOrg.name || this.queryOrg.code) {
                const resp = await this.dispatch(
                    OrgController.queryPositionsToTree,
                    this.queryOrg
                );
                if (!resp.error) {
                    this.gridData = resp.data;
                    this.tableDataOrg = resp.data.data.map(i => {
                        return {
                            ...i,
                            extra: {
                                type: this.activeName,
                                name: this.dictType[this.activeName],
                            },
                            extraType: this.activeName
                        }
                    });
                }
            }
        },
        async getDataEmp() {
            if (this.queryOrg.name || this.queryOrg.code) {
                this.queryOrg.flag = this.flag;
                const resp = await this.dispatch(
                    SelectionComponentController.queryEmployee,
                    this.queryOrg
                );
                if (!resp.error) {
                    this.gridData = resp.data;
                    this.tableDataOrg = resp.data.data.map(i => {
                        return {
                            ...i,
                            extra: {
                                type: this.activeName,
                                name: this.dictType[this.activeName],
                            },
                            extraType: this.activeName
                        }
                    })
                }
            }
        },
        async getDataUser() {
            if (this.queryOrg.name || this.queryOrg.code) {
                this.queryOrg.flag = this.flag;
                const resp = await this.dispatch(
                    SelectionComponentController.queryUser,
                    this.queryOrg
                );
                if (!resp.error) {
                    this.gridData = resp.data;
                    this.tableDataOrg = resp.data.data.map(i => {
                        return {
                            ...i,
                            extra: {
                                type: this.activeName,
                                name: this.dictType[this.activeName],
                            },
                            extraType: this.activeName
                        }
                    })
                }
            }
        },
        handleName(data) {
            let value = "";
            if (data.name) {
                value = data.name + (data.code ? " ( " + data.code + " )" : "");
            }
            return value;
        },
        async changePageSizer(pageSize) {
            this.queryOrg.pageSize = pageSize;
            this.changePage();
        },
        async changePage(index) {
            this.queryOrg = {
                ...this.queryOrg,
                pageIndex: index || 0,
            };
            this.getData();
        },
        changeBreadPage() {

            this.changeList(this.currentData)
        },
        handleCheckChangeLeft(data, checked, indeterminate) {
            console.log(data)
            if (!this.isMultiple) {
                const nodes = this.$refs.treeLeft.getCheckedNodes();
                this.turnSingle(nodes, data, "treeLeft", true);
            } else {
                this.selections = this.$refs.treeLeft.getCheckedNodes();
                if (checked === true) {
                    this.addUsers();
                } else if (!indeterminate) {
                    this.selectionsOrg = [data];
                    this.removeUsers(data);
                }
            }
        },
        turnSingle(selections, row, type, isTree) {
            if (!this.isMultiple) {
                let _selections = _.cloneDeep(selections)
                let _row = _.cloneDeep(row)
                if (isTree) {
                    _selections.forEach(i => {
                        i.extra = {
                            type: this.activeName,
                            name: this.dictType[this.activeName],
                        }
                        i.extraType = this.activeName
                    })
                    _row.extra = {
                        type: this.activeName,
                        name: this.dictType[this.activeName],
                    }
                    _row.extraType = this.activeName
                }
                let tableDataSelect = [];
                if (_selections.length === 2) {
                    if (isTree) {
                        const tableSelections = _selections.filter(
                            (item) => this.isSame(item, _row) && item.id === _row.id
                        );
                        this.$refs[type].setCheckedNodes(tableSelections);
                    } else {
                        const tableSelections = _selections.filter(
                            (item) => !this.isSame(item, _row) && item.id !== _row.id
                        );
                        this.$refs[type].$refs.tableRef.toggleRowSelection(
                            tableSelections[0],
                            false
                        );
                    }
                    tableDataSelect = [_row];
                } else if (_selections.length === 1) {
                    tableDataSelect = _selections;
                } else {
                    // 取消选中
                    if (this.tableDataSelect.some(i => i.id === _row.id && i.extraType === _row.extraType)) {
                        tableDataSelect = []
                    } else {
                        tableDataSelect = _.cloneDeep(this.tableDataSelect)
                    }
                }
                this.tableDataSelect = _.cloneDeep(tableDataSelect);
                this.$emit("change", this.tableDataSelect, this.activeName);
            }
        },

        async addUsers() {
            let tableDataSelect = [];
            let nodes = this.selections;
            await nodes.forEach(async (item) => {
                item.extra = {
                    type: this.activeName,
                    name: this.dictType[this.activeName],
                };
                item.extraType = this.activeName
                if (item.type === "position") {
                    // 根据机构获取人员
                    let users;
                    if (this.positionSearch) {
                        const resp = await this.positionSearch.call(this, {
                            types: item.id,
                        });
                        users = resp?.data?.data ? resp.data.data : [];
                    } else {
                        users = await this.getUsersByPositionType(item.id);
                    }
                    users.forEach((i) => {
                        i.extra = {
                            type: this.activeName,
                            name: this.dictType[this.activeName],
                        };
                        i.extraType = this.activeName
                    });
                    tableDataSelect = tableDataSelect.concat(users);
                    this.delRepeat(tableDataSelect);
                    this.$emit("change", this.tableDataSelect, this.activeName);
                } else {
                    if (this.activeName === "emp" || this.activeName === "user") {
                        if (this.activeName === "user") {
                            if (item.employee && item.employee.name) {
                                item.name = item.employee.name;
                            }
                        }
                        if (item.type != "org") {
                            tableDataSelect.unshift(item);
                        }
                    } else {
                        tableDataSelect.unshift(item);
                    }
                    this.delRepeat(tableDataSelect);
                    this.$emit("change", this.tableDataSelect, this.activeName);
                }
            });
            if (this.showTreeOrg) {
                // this.$refs.treeLeft.setCheckedKeys([]) //有时候不管用
                // let node = this.$refs.treeLeft.getNode(this.rootData[0].id).parent;
                // this.setCheckedKeys(node)
            } else {
                this.selections = [];
                // this.$refs.multipleTable.$refs.tableRef.clearSelection()
            }
        },
        setCheckedKeys(node) {
            if (node.childNodes && node.childNodes.length > 0) {
                node.childNodes.map((val) => {
                    val.checked = false;
                    this.setCheckedKeys(val);
                });
            }
        },
        // 根据根节点ids查询员工
        async getUsersByPositionType(id) {
            const resp = await this.dispatch(OrgController.queryPositionsToTree, {
                types: id,
            });
            if (!resp.error) {
                return resp.data.data;
            }
        },
        addAllUsers() {
            // 查询跟节点对应的人员
            console.log(this.activeName)
            if (this.showTreeOrg) {
                if (this.activeName === "position") {
                    let tableDataSelect = [];
                    this.breadModeData &&
                    this.breadModeData.forEach(async (item) => {
                        const resp = await this.dispatch(
                            OrgController.queryPositionsToTree,
                            {
                                types: item.id,
                            }
                        );
                        console.log(resp)
                        if (!resp.error) {
                            tableDataSelect = tableDataSelect.concat(resp.data.data);
                            tableDataSelect.forEach(
                                (item) => {
                                    item.extra = {
                                        type: this.activeName,
                                        name: this.dictType[this.activeName],
                                    }
                                    item.extraType = this.activeName
                                });
                            this.delRepeat(this.breadModeData);
                            this.$emit("change", this.tableDataSelect, this.activeName);
                        }
                    });
                } else {
                    let tableDataSelect = [];
                    tableDataSelect = _.cloneDeep(this.rootData);
                    tableDataSelect.forEach(
                        (item) => {
                            item.extra = {
                                type: this.activeName,
                                name: this.dictType[this.activeName],
                            }
                            item.extraType = this.activeName
                        });
                    this.delRepeat(tableDataSelect);
                    this.$emit("change", this.tableDataSelect, this.activeName);
                }
                this.$refs.treeLeft.setCheckedNodes(this.rootData);
            } else {
                let tableDataSelect = [];
                tableDataSelect = _.cloneDeep(this.tableDataOrg);
                tableDataSelect.forEach(
                    (item) => {
                        item.extra = {
                            type: this.activeName,
                            name: this.dictType[this.activeName],
                        }
                        item.extraType = this.activeName
                    });
                this.delRepeat(tableDataSelect);
                this.$emit("change", this.tableDataSelect, this.activeName);
            }
        },
        // 去重
        delRepeat(tableDataSelect) {
            if (this.tableDataSelect.length > 0) {
                tableDataSelect.forEach((item) => {
                    const user = this.tableDataSelect.every((tem) => !(this.isSame(item, tem) && tem.id === item.id) || tem.id !== item.id);
                    if (user) {
                        this.tableDataSelect.unshift(item);
                    }
                });
            } else {
                this.tableDataSelect = _.cloneDeep(tableDataSelect);
            }
        },
        async removeUsers(data) {
            let tableDataSelect = [];
            if (data.type === "position") {
                let users;
                if (this.positionSearch) {
                    const resp = await this.positionSearch.call(this, {types: data.id});
                    users = resp?.data?.data ? resp.data.data : [];
                } else {
                    users = await this.getUsersByPositionType(data.id);
                }
                tableDataSelect = this.tableDataSelect.filter((i) =>
                    users.every((j) => !(this.isSame(i, j) && i.id === j.id) || i.id !== j.id)
                );
            } else {
                tableDataSelect = this.tableDataSelect.filter(i => {
                    return this.selectionsOrg.every(j => i.id !== j.id || !(this.isSame(i, j)) && i.id === j.id)
                });
            }
            this.$emit("change", tableDataSelect, this.activeName);
            this.$set(this, "tableDataSelect", tableDataSelect);
        },
        removeAllUsers() {
            this.$set(this, "tableDataSelect", []);
            this.$emit("change", [], this.activeName);
            this.$refs.treeLeft.setCheckedKeys([]);
        },
        async changePosition(node) {
            if (node.type === 'position' || node.orgLevel === 0) {
                this.breadcrumbList = this.breadcrumbList.slice(0, node.type === 'position' ? 1 : node.orgLevel)
                this.breadcrumbList.push(node)
                const data = node
                this.currentData = node
                let nodes = []
                if (node.orgLevel === 0) {
                    this.breadCurrent = 1
                    const resp = await this.dispatch(
                        PositionController.queryPositionTypes,
                    );
                    nodes = resp.data.data.map((item) => {
                        item.type = "position";
                        item.disabled = !this.isMultiple;
                        return item;
                    });
                    this.rootData = nodes;
                    this.breadModeData = nodes
                } else {
                    let nodesOrg;
                    console.log(this.positionSearch)
                    if (this.positionSearch) {
                        nodesOrg = await this.positionSearch.call(this, {
                            types: data.id,
                            pageIndex: this.breadCurrent - 1,
                            pageSize: 20
                        });
                    } else {
                        nodesOrg = await this.dispatch(OrgController.queryPositionsToTree, {
                            types: data.id,
                            pageIndex: this.breadCurrent - 1,
                            pageSize: 20
                        });
                    }
                    nodes = nodesOrg.data.data.map((item) => {
                        return {
                            ...item,
                            leaf: true,
                            extra: {
                                type: this.activeName,
                                name: this.dictType[this.activeName],
                            },
                            extraType: this.activeName
                        };
                    });
                    this.breadTotal = nodesOrg.data.total
                }
                this.breadModeData = nodes
            } else {
                this.setTableDataSelect(node)
            }
            this.breadModeData = this.breadModeData.map(i => {
                i.checked = this.tableDataSelect.some(n =>  i.id === n.id && i.extraType === n.extraType)
                return i
            })
        },
        async changeList(node) {
            console.log(node)
            console.log(this.activeName)
            if (node.type === 'org') {
                this.breadcrumbList = this.breadcrumbList.slice(0, node.type === 'position' ? 1 : node.orgLevel)
                this.breadcrumbList.push(node)
            }

            const localData = JSON.parse(localStorage.getItem('localData')) || {} // 本地缓存
            if (localData[this.activeName + node.id] && node.type === 'org') { // 本地缓存
                this.breadModeData = localData[this.activeName + node.id]
            } else {
                if (this.activeName === "position") {
                    await this.changePosition(node)
                } else if (this.activeName === "user") {
                    console.log(this.tableDataSelect)
                    let nodes = [];
                    if (node.orgLevel === 0) {
                        const resp = await this.dispatch(
                            SelectionComponentController.queryOrg,
                        );
                        this.breadModeData = resp.data.map((item) => {
                            item.type = "org";
                            item.disabled = true;
                            return item;
                        });
                        this.rootData = nodes;
                    } else {
                        if (node.type === 'org') {
                            let nodesOrg = [];
                            let nodesUser = [];
                            const resp1 = await this.dispatch(
                                SelectionComponentController.queryChildByParentId,
                                {
                                    parentId: node.id,
                                }
                            );
                            nodesOrg = resp1.data.map((item) => {
                                item.type = "org";
                                item.disabled = true;
                                return item;
                            });
                            // 人员
                            const resp2 = await this.dispatch(OrgController.queryUsersByOrgId, {
                                orgId: node.id,
                            });
                            if (!resp2.error) {
                                nodesUser = resp2.data.data.map((item) => {
                                    if (item.employee && item.employee.name) {
                                        item.name = item.employee.name;
                                    } else {
                                        // 员工接口拿到的账号是code
                                        const name = item.name
                                        item.name = item.code
                                        item.code = name
                                    }
                                    item.leaf = true;
                                    return item;
                                });
                            }
                            this.breadModeData = nodesUser.concat(nodesOrg);
                            this.breadModeData = this.breadModeData.map(i => {
                                return {
                                    ...i,
                                    extra: {
                                        type: this.activeName,
                                        name: this.dictType[this.activeName],
                                    },
                                    extraType: this.activeName
                                }
                            })
                            // nodes = nodesUser.concat(nodesOrg);
                        } else {
                            this.setTableDataSelect(node)
                        }

                    }
                } else if (this.activeName === "emp") {
                    let nodes = [];
                    if (node.orgLevel === 0) {
                        const resp = await this.dispatch(
                            SelectionComponentController.queryOrg,
                            this.queryOrg
                        );
                        this.breadModeData = resp.data.map((item) => {
                            item.type = "org";
                            item.disabled = true;
                            return item;
                        });
                        this.rootData = nodes;
                    } else {
                        if (node.type === 'org') {
                            let nodesOrg = [];
                            let nodesUser = [];
                            const resp1 = await this.dispatch(
                                SelectionComponentController.queryChildByParentId,
                                {
                                    parentId: node.id,
                                }
                            );
                            nodesOrg = resp1.data.map((item) => {
                                item.type = "org";
                                item.disabled = true;
                                return item;
                            });
                            // 人员
                            const resp2 = await this.dispatch(OrgController.queryEmployeesInOrg, {
                                orgId: node.id,
                                employeeStatus: 1,
                            });
                            if (!resp2.error) {
                                nodesUser = resp2.data.data.map((item) => {
                                    return {
                                        ...item,
                                        leaf: true,
                                    };
                                });
                            }
                            this.breadModeData = nodesUser.concat(nodesOrg);
                            this.breadModeData = this.breadModeData.map(i => {
                                return {
                                    ...i,
                                    extra: {
                                        type: this.activeName,
                                        name: this.dictType[this.activeName],
                                    },
                                    extraType: this.activeName
                                }
                            })
                        } else {
                            this.setTableDataSelect(node)
                        }
                    }
                }
            }


            this.breadModeData = this.breadModeData.map(i => {
                i.checked = this.tableDataSelect.some(n => i.id === n.id && i.extraType === n.extraType)
                return i
            })

            if (node.id) {
                localData[this.activeName + node.id] = this.breadModeData
                localStorage.setItem('localData', JSON.stringify(localData))
                console.log('localData', localData)
            }
        },
        async loadNode(node, resolve) {
            console.log(node)
            if (this.activeName === "org") {
                const {data} = node;
                let nodes = [];
                if (node.level === 0) {
                    const resp = await this.dispatch(
                        SelectionComponentController.queryOrg,
                        this.queryOrg
                    );
                    nodes = resp.data.map((item) => {
                        item.type = "org";
                        return item;
                    });
                    this.rootData = nodes;
                } else {
                    let nodesOrg = [];
                    const resp = await this.dispatch(
                        SelectionComponentController.queryChildByParentId,
                        {
                            parentId: data.id,
                        }
                    );
                    nodesOrg = resp.data.map((item) => {
                        item.type = "org";
                        return item;
                    });
                    nodes = nodesOrg;
                }
                return resolve(nodes);
            } else if (this.activeName === "position") {
                const {data} = node;
                let nodes = [];
                if (node.level === 0) {
                    const resp = await this.dispatch(
                        PositionController.queryPositionTypes,
                        this.queryOrg
                    );
                    nodes = resp.data.data.map((item) => {
                        item.type = "position";
                        item.disabled = !this.isMultiple;
                        return item;
                    });
                    this.rootData = nodes;
                } else {
                    let nodesOrg;
                    if (this.positionSearch) {
                        nodesOrg = await this.positionSearch.call(this, {
                            types: data.id,
                        });
                    } else {
                        nodesOrg = await this.dispatch(OrgController.queryPositionsToTree, {
                            types: data.id,
                        });
                    }
                    nodes = nodesOrg.data.data.map((item) => {
                        return {
                            ...item,
                            leaf: true,
                        };
                    });
                }
                return resolve(nodes);
            } else if (this.activeName === "user") {
                const {data} = node;
                let nodes = [];
                if (node.level === 0) {
                    const resp = await this.dispatch(
                        SelectionComponentController.queryOrg,
                        this.queryOrg
                    );
                    nodes = resp.data.map((item) => {
                        item.type = "org";
                        item.disabled = true;
                        return item;
                    });
                    this.rootData = nodes;
                } else {
                    let nodesOrg = [];
                    let nodesUser = [];
                    const resp1 = await this.dispatch(
                        SelectionComponentController.queryChildByParentId,
                        {
                            parentId: data.id,
                        }
                    );
                    nodesOrg = resp1.data.map((item) => {
                        item.type = "org";
                        item.disabled = true;
                        return item;
                    });
                    // 人员
                    const resp2 = await this.dispatch(OrgController.queryUsersByOrgId, {
                        orgId: data.id,
                    });
                    if (!resp2.error) {
                        nodesUser = resp2.data.data.map((item) => {
                            if (item.employee && item.employee.name) {
                                item.name = item.employee.name;
                            } else {
                                // 员工接口拿到的账号是code
                                const name = item.name
                                item.name = item.code
                                item.code = name
                            }
                            item.leaf = true;
                            return item;
                        });
                    }
                    nodes = nodesUser.concat(nodesOrg);
                }
                if (this.isMultiple && node.data && node.data.type === 'org' && nodes.some(i => i.type !== 'org')) {
                    this.$set(node.data, 'disabled', false)
                }
                return resolve(nodes);
            } else if (this.activeName === "emp") {
                const {data} = node;
                let nodes = [];
                if (node.level === 0) {
                    const resp = await this.dispatch(
                        SelectionComponentController.queryOrg,
                        this.queryOrg
                    );
                    nodes = resp.data.map((item) => {
                        item.type = "org";
                        item.disabled = true;
                        return item;
                    });
                    this.rootData = nodes;
                } else {
                    let nodesOrg = [];
                    let nodesUser = [];
                    const resp1 = await this.dispatch(
                        SelectionComponentController.queryChildByParentId,
                        {
                            parentId: data.id,
                        }
                    );
                    nodesOrg = resp1.data.map((item) => {
                        item.type = "org";
                        item.disabled = true;
                        return item;
                    });
                    // 人员
                    const resp2 = await this.dispatch(OrgController.queryEmployeesInOrg, {
                        orgId: data.id,
                        employeeStatus: 1,
                    });
                    if (!resp2.error) {
                        nodesUser = resp2.data.data.map((item) => {
                            return {
                                ...item,
                                leaf: true,
                            };
                        });
                    }
                    nodes = nodesUser.concat(nodesOrg);
                }
                if (this.isMultiple && node.data && node.data.type === 'org' && nodes.some(i => i.type !== 'org')) {
                    this.$set(node.data, 'disabled', false)
                }
                return resolve(nodes);
            }
        },
        selectionChangeOrg(selections) {
            this.tableDataSelect = selections;
            this.$emit("change", selections, this.activeName);
        },
        setTableDataSelect(node) {
            console.log(1111)
            if (!this.tableDataSelect.some(i => i.id === node.id && i.extraType === node.extraType)) {

                if (this.isMultiple) {
                    this.tableDataSelect.push(node)
                } else {
                    this.tableDataSelect = []
                    this.tableDataSelect.push(node)
                }
            } else {
                this.tableDataSelect.splice(this.tableDataSelect.findIndex(n => n.id === node.id && n.extraType === node.extraType), 1)
            }

            if (this.isMultiple) {
                this.$emit("change", this.tableDataSelect, this.activeName);
            } else {

                if (this.tableDataSelect.length) {
                    this.$emit("change", this.tableDataSelect, this.activeName);
                } else {
                    this.$emit("change", this.tableDataSelect, this.activeName);
                }
            }
            console.log(this.tableDataSelect)
        },
        selectionChange(selections, row) {
            console.log(selections, row, 'selections, row')
            let _selections = _.cloneDeep(selections);
            if (!this.isMultiple) {
                let _row = _.cloneDeep(row);
                this.selections = [_row];
                this.tableDataSelect = _.cloneDeep(this.selections);
                this.turnSingle(_selections, _row, "multipleTable");
            } else {
                this.selections = _selections;
                this.tableDataSelect = _.cloneDeep(this.selections);
                this.$emit("change", this.tableDataSelect, this.activeName);
            }
        },
        isSame(a, b) {
            return a.extraType === b.extraType
        }
    },
};
</script>
<style lang="scss" scoped>
.el-row {
  .selectUser_table {
    .el-row {
      height: 50px;
    }
  }

  .block {
    height: 400px;
    overflow: auto;
    border: 1px solid #ddd;
    border-top: none;
  }

  .right_title {
    border: 1px solid #ddd;
    background: #f5f5f5;
    color: #8f8888;
    padding-left: 10px;
    height: 32px;
  }

  .move_btns {
    margin-top: 170px;
    text-align: center;
  }
}

.el-tree-node {
  position: relative;
  padding-left: 16px;
}

.el-tree-node::before {
  border-left: 1px dashed #4386c6;
  bottom: 0px;
  height: 100%;
  top: -20px;
  width: 1px;
}

.el-tree-node::after {
  border-top: 1px dashed #4386c6;
  height: 20px;
  top: 17px;
  width: 24px;
}

.pagination {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: right;
  border: none !important;
}

::v-deep .el-input--mini .el-input__inner {
  height: 32px;
}

::v-deep .el-tree-node__content {
  height: 32px;
}

.svgicon {
  width: 18px;
  height: 17px;
  margin-right: 7px;
}

.one_warp {
  width: 75%;
  height: 20px;
  line-height: 20px;
  margin-bottom: -5px;
  overflow-y: hidden;
  display: inline-block;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-breadcrumb__inner {
  &:hover {
    font-weight: bold;
    cursor: pointer;
  }
}

.top-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  background: #f5f5f5;

  .scroll-bar {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>

