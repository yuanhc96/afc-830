import { Validator } from '@lib'

export default {
  'roleCode': [
    { 'required': true, 'message': '角色代码不能为空!' },
    { 'validator': Validator.code },
    { max: 30, message: '角色代码长度不超过30个字符!' },
  ],
  'roleName': [
    { 'required': true, 'message': '角色名称不能为空!' },
    { 'validator': Validator.name },
    { max: 30, message: '角色名称长度不超过30个字符!' },
  ]
}
