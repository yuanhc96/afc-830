import { Validator } from '@lib'

export default {
  'orgname': [
    { required: true, message: '机构名称不能为空!' },
    { min: 1, max: 64, message: '机构名称长度范围1~64个字符!' }
  ],
  'orgcode': [
    { required: true, message: '机构编号不能为空!' },
    { min: 1, max: 32, message: '机构编号长度范围1~32个字符!' }
  ],
  'status': [
    { required: true, message: '机构状态不能为空!' },
  ],
  'orgtype': [
    { required: true, message: '机构类型不能为空!' },
  ],
  'orgdegree': [
    { required: true, message: '机构等级不能为空!' },
  ],
  'area': [
    { max: 30, message: '所属地域长度不超过30个字符!' }
  ],
  'orgaddr': [
    { max: 256, message: '机构地址长度不超过256个字符!' }
  ],
  'zipcode': [
    { validator: Validator.zipcode }
  ],
  'linkman': [
    { max: 30, message: '联系人长度不超过30个字符!' }
  ],
  'linktel': [
    { max: 20, message: '联系电话长度不超过20个字符!' }
  ],
  'email': [
    { max: 128, message: '电子邮件长度不超过128个字符!' },
    { validator: Validator.email }
  ],
  'weburl': [
    { max: 512, message: '网站地址长度不超过512个字符!' },
    { validator: Validator.url }
  ],
  'remark': [
    { max: 512, message: '备注长度不超过512个字符!' },
  ],
}
