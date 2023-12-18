import { Validator } from '@lib'

export default {
  posiname: [
    { required: true, message: '岗位名称不能为空!' },
    { max: 128, message: '岗位名称长度不超过128个字符!' }
  ],
  posicode: [
    { required: true, message: '岗位编码不能为空!' },
    { max: 20, message: '岗位编码长度不超过20个字符!' }
  ],
}
