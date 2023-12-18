import { Validator } from '@lib'

export default {
  'menucode': [
    { required: true, message: '菜单代码不能为空!' },
    { Validator: Validator.code },
    { min: 1, max: 20, message: '菜单代码长度范围1~20个字符!' }
  ],
  'menuname': [
    { required: true, message: '菜单名称不能为空!' },
    { Validator: Validator.name },
    { min: 1, max: 20, message: '菜单名称长度范围1~20个字符!' }
  ],
  'menulabel': [
    { required: true, message: '菜单显示名称不能为空!' },
    { Validator: Validator.name },
    { min: 1, max: 20, message: '菜单显示长度范围1~20个字符!' }
  ],
 
}
