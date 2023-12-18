
export default {
  // 'eosDictType.dicttypeid': [
  //   {required: true, message: '字典类型不能为空!'},
  // ],
  name: [
    { required: true, message: '字典名称不能为空!' },
    { min: 1, max: 255, message: '字典编码长度范围1~255个字符!' },
  ],
  code: [
    { required: true, message: '字典编码不能为空!' },
    { min: 1, max: 128, message: '字典编码长度范围1~128个字符!' },
  ],
}
