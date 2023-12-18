import  { PositionController,OrgController,WorkGroupController,EmployeeController,UserController} from "@controller";
export  const  controller = {
    "UserController.queryRole":UserController.queryRolesInUser,
    "UserController.deleteRole":UserController.deleteRolesInUser,
    // "UserController.disable":UserController.disableEmployee,
    // "UserController.enable":UserController.enableEmployee,
    "UserController.create":UserController.createRolesInUser,
    "WorkGroupController.query":WorkGroupController.queryRolesInWorkGroup,
    "WorkGroupController.create":WorkGroupController.createRolesInWorkGroup,
    "WorkGroupController.delete":WorkGroupController.deleteRolesInWorkGroup,
    "PositionController.query":PositionController.queryRolesInPosition,
    "PositionController.create":PositionController.createRolesInPosition,
    "PositionController.delete":PositionController.deleteRolesInPosition,
    "OrgController.create":OrgController.createRolesInOrg,
    "OrgController.delete":OrgController.deleteRolesInOrg,
    "OrgController.query":OrgController.queryRolesInOrg,
    "EmployeeController.query":EmployeeController.queryRolesInEmployee,
    "EmployeeController.create":EmployeeController.createRolesInEmployee,
    "EmployeeController.delete":EmployeeController.deleteRolesInEmployee,

}