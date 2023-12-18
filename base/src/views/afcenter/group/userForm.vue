<template>
  <div class="user-form">
    
  </div>
</template>

<script>
import { EmployeeController, WorkGroupController } from '@controller';
import { BaseVue, List } from "@lib";
export default {
  name: "CoframeForm",
  mixins: [BaseVue,List],
  props: {
    workGroupData:{},
    actionVisible: { type: Boolean, default: () => false },
    actionVisible: { type: String, default: () => "添加" },
  },
  data() {
    // const generateData = (_) => {
    //   const data = [];
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       key: i,
    //       label: `备选项 ${i}`,
    //     });
    //   }
    //   return data;
    // };
    return {
      leftArray:[],
      rightArray:[],
      data: [],
      value: [],
    };
  },

  mounted() {
    this.queryEmployees()
  },
  watch: {
    workGroupData(value){
      if(value)
       this.queryEmployeesByWorkGroupId()

    }
  },
  methods: {
    // 处理穿梭框右侧变动
    handleChange(value, direction, movedKeys){
      if(direction==='left'){
        this.leftArray.push(...movedKeys)
      }else{
        this.rightArray.push(...movedKeys)
      }
    },
    // 请求员工数据
    async queryEmployees(){
     const resp = await this.dispatch(EmployeeController.queryEmployeesByTenantId,{
       ...this.query,
     })
     if(!resp.error){
       const data = []
       for (let i = 0; i <= resp.data.data.length-1; i++) {
        const employee = resp.data.data[i]

        data.push({
          key: employee.id,
          label: employee.name,
          disabled:false
        });
      }
      this.data = data
     }
    },
    // 工作组 批量添加员工
    async handleEmployees(){
      const resp = await this.dispatch(WorkGroupController.createEmployeesUnderWorkgroup,{
        employeeIds:this.value,
        workGroupId:this.workGroupData.id,
      })
      if(!resp.error){
        this.$msg.success("操作成功！")
      }
    },
    // 请求工作组员工数据
    async queryEmployeesByWorkGroupId(){
      const resp = await this.dispatch(WorkGroupController.queryEmployeesByWorkGroupId,{
        ...this.query,
        id:this.workGroupData.id,
      })
      if(!resp.error){
        const data = resp.data.data.map(i=>{
          return i.id
        })
        this.value = data
      }
    }
  },
};
</script>

<style lang="scss" scoped>
    .user-form {
        width: 562px;
        margin: 0 auto;
    }
</style>
