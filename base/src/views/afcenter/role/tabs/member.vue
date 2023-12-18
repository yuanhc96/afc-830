<template>
    <div class="pr-20">
    <div class="top-block">
      <el-row>
        <el-col :span="16">
          <PmToolbar>
            <PmToolbarItem v-permission="FuncCode.afc_f_auth_role_party_bind" plain @click="openAdd" icon="el-icon-plus">添加成员</PmToolbarItem>
            <PmToolbarItem v-permission="FuncCode.afc_f_auth_role_party_unbind" plain :disabled="selections.length==0" @click="deleteClick">批量删除</PmToolbarItem>
          </PmToolbar>
        </el-col>
        <el-col :span="8" class="text-right">
          <PmSearch style="width: 300px;" class="float-right" :query.sync="query" defaultProp="name" @search="search" placeholder="搜索成员类型">
            <template slot="body">
              <el-form-item label="成员类型" prop="types">
                <el-select placeholder="请选择" v-model="query.types" @change="changeSelect" style="width:100%;">
                    <el-option
                        v-for="item in objectType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    />
                </el-select>
              </el-form-item>
            </template>
          </PmSearch>
        </el-col>
      </el-row>
    </div>
    <el-table 
      :id="tableId" 
      :height="autoTableHeight"
      border
      stripe
    :highlight-current-row="true" v-loading="RoleController.queryRolesWithPage.loading"
     :data="gridList" @sort-change="sortChange" @selection-change="selectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="成员类型" prop="code">
          <template slot-scope="{row}">
            <span>{{dictType[row.partyType]}} </span>
          </template>
        </el-table-column>
        <el-table-column label="成员名称" prop="partyName" />
        <el-table-column label="操作" width="200px">
            <template slot-scope="{row}">
              <PmToolbar>
                  <PmToolbarItem type="text" v-permission="FuncCode.afc_f_auth_role_party_unbind" @click="remove(row)">删除</PmToolbarItem>
              </PmToolbar>
          </template>
        </el-table-column>
    </el-table>
    <Pagination 
        :selections="selections"
        :page-size="query.limit"
        :current-page.sync="query.offset"
        :total="gridTotal"
        @size-change="changePageSizer"
        @current-change="changePage"
    />
    <select-types :dialog-visible.sync="dialogVisible" :isMultiple="true" :partyTypes="objectType" :form.sync="form" @sure="sure" ></select-types>
  </div>
</template>

<script>
import { AuthManagerController, DictTypeController, RoleController } from '@controller'
import { BaseVue, List, VueUtil } from '@lib'
import { mapGetters } from 'vuex'
import FormDialog from '../form.vue'
export default {
  name:'member',
  components: { FormDialog },
  mixins: [BaseVue, List],
  props:{ 
    form:{
      type:Object,
      default: {}
    },
  },
  data(){
      return{
          tableHeight: 'calc(100vh - 205px)',
          detailVisible: false,
          resources: [],
          organizationShow: false,
          options: [],
          objectType:[],
          dictType:{},
          dicttypeid: 'sys_party_types',
          dialogVisible: false
      }
  },
  watch: {
    dicts:{
      immediate: true,
      handler(val) {
        if(val){
          this.objectType = this.dicts[this.dicttypeid].filter(item=>item.code!=='role_app') || []
          if(this.objectType.length>0){
            let dictType = {}
            this.objectType.forEach(item=>{
              dictType[item.code] = item.name
            })
            this.dictType = dictType
          }
          
        }
      },
    }
  },
  computed: {
		...mapGetters(['dicts']),
    ...VueUtil(this)
      .select([  RoleController,AuthManagerController,DictTypeController])
      .state(),
	},
  mounted() {
    this.loadData()
    this.search()
  },
  methods:{
    async searchBody() {
      let query = this.otherQuery(this.query) 
      let payload = {roleId:this.form.id, ...query}
      const resp = await this.dispatch(AuthManagerController.queryMembersWithPage, payload)
      return resp
    },
    async removeBody(row) {
      let payload = {
        partyRoles:[
          {
              partyId:row.partyId,
              partyType:row.partyType,
              role: {
                id:row.role.id
              },
              id:row.id
          }
        ]
      }
      const resp = await this.dispatch(AuthManagerController.delPartyAuth, payload)
      return resp
    },
    //批量删除
    async deleteClick(){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
          const partyRoles = this.selections.map(sel => {
            let item = {
              partyId:sel.partyId,
              partyType:sel.partyType,
              role: {
                id:sel.role.id
              },
              id:sel.id
          }
            return item
          })
          let payload = { partyRoles:partyRoles }
          const resp = await this.dispatch(AuthManagerController.delPartyAuth,payload)
          if (!resp.error) {
            this.pmSearch()
            this.$msg.success('删除成功')
          }
        })
        .catch(() => {
          
        })
    },
    submitAdd(value){
      this.organizationShow = false
      this.query.resId = value[0].id
      this.search()
    },
    cancelAdd(){
      this.organizationShow = false
    },
    gotoDetail(app,tab){
      this.$emit('gotoDetail',app,tab,this.$props)
    },
    async loadData() {
			if (!this.dicttypeid) { return }
			if (!this.dicts.hasOwnProperty(this.dicttypeid)) {
				this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: null })
				const resp = await this.dispatch(DictTypeController.queryDictTypesByCriteria, {
					code: this.dicttypeid,
					tenantId: this.currentTenant,
				})
				if (!resp.error) {
					this.$store.commit('ADD_DICT', { key: this.dicttypeid, value: resp.data.data.length ? resp.data.data[0].dictEntrys : [] })
				}
			}
		},
    async sure(selectData){
      let partyRole = selectData.map(item=>{
        let data = {
              partyId:item.id,
              partyType: item.extra.type,
              role: {
                id: this.form.id
              },
              roleType: this.form.types
          }
        return data
      })
      let payload = {partyRole:partyRole}
      const resp = await this.dispatch(AuthManagerController.handlePartyAuth,payload)
      if (!resp.error) {
        this.$msg.success('添加成功')
        this.search()
      }
    }
  }
}
</script>
