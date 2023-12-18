/**
 * 岗位接口
 */
import  {OrgController} from "@controller";
export  const  controller = {
    //查询人员岗位
    employeeQuery:OrgController.queryPositionsInOrg,
    //添加人员岗位
    employeeCreate:OrgController.updatePositionsInOrg,
    //删除人员岗位
    employeeDelete:OrgController.deleteEmployeesInOrg,
    //机构管理员资源 query
    orgResourceQuery:OrgController.queryResourceInOrg,
    //机构管理员资源 set
    orgResourceSet:OrgController.queryResourceInOrg,
    //机构管理员资源 delete
    orgResourceDelete:OrgController.queryResourceInOrg

}