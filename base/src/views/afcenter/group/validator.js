import { Validator } from '@lib'

export default {
  'groupname': [
    { required: true, message: '工作组名称不能为空!' },
    { min: 1, max: 50, message: '字典类型编码长度范围1~50个字符!' },
  ],
  'groupcode': [
    { required: true, message: '工作组编码不能为空!' },
  ],
  'groupstatus': [
    { required: true, message: '工作组状态不能为空!' },
  ],
  'grouptype': [
    { required: true, message: '工作组类型不能为空!' },
  ],
  'groupdesc$': [
    { min: 1, max: 50, message: '字典类型编码长度范围1~50个字符!' },
  ],
}
