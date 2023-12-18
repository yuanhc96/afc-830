
export default {
  name: [
    { required: true, message: '字典类型名称不能为空!' },
    { min: 1, max: 255, message: '字典类型编码长度范围1~255个字符!' },
  ],
  code: [
    { required: true, message: '字典类型编码不能为空!' },
    { min: 1, max: 128, message: '字典类型编码长度范围1~128个字符!' },
  ],
}
