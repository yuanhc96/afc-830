  const operators = [
    {
      t: '等于',
      k: '=',
    },
    {
      t: '大于',
      k: '>',
    },
    {
      t: '不小于',
      k: '>=',
    },
    {
      t: '小于',
      k: '<',
    },
    {
      t: '不大于',
      k: '<=',
    },
    {
      t: '不等于',
      k: '<>',
    },
    {
      t: '介于',
      k: 'between',
    },
    {
      t: '不介于',
      k: 'not_between',
    },
    {
      t: '包含',
      k: 'all',
    },
    { 
      t: '不包含', 
      k: 'none',
    },
    {
      t: '开头是',
      k: 'start_with',
    },
    {
      t: '结尾是',
      k: 'end_with',
    }
  ]
const numberOperators = [
  {
    t: '等于',
    k: '=',
  },
  {
    t: '大于',
    k: '>',
  },
  {
    t: '不小于',
    k: '>=',
  },
  {
    t: '小于',
    k: '<',
  },
  {
    t: '不大于',
    k: '<=',
  },
  {
    t: '不等于',
    k: '<>',
  },
  {
    t: '介于',
    k: 'between',
  },
  {
    t: '不介于',
    k: 'not_between',
  }
]
const dateOperators = [
  {
    t: '介于',
    k: 'between',
  },
  {
    t: '不介于',
    k: 'not_between',
  }
]
const textOperators = [
  {
    t: '等于',
    k: '=',
  },
  {
    t: '不等于',
    k: '<>',
  },
  {
    t: '包含',
    k: 'all',
  },
  {
    t: '不包含',
    k: 'none',
  },
  {
    t: '开头是',
    k: 'start_with',
  },
  {
    t: '结尾是',
    k: 'end_with',
  }
]
const condition = {
  op: "=",
  minValue: null,
  isNot: false,
  propertyName: "",
  maxValue: null,
  propertyType: "constant",
  orgType:'',
  propertyValue: "",
  not: false,
  controlContent:{
    type:"constant",
    controlValue:''
  }
}
const propertySubOptions = [
  {
    name:'机构',
    type:'sub_org'
  },
  {
    name:'用户',
    type:'sub_user'
  }
]
const orgOptions = [
  {
    name:'当前用户所在部门',
    type:'curr_org'
  },
  {
    name:'当前用户所在部门及子部门',
    type:'curr_org_and_child'
  },
  {
    name:'指定部门',
    type:'specific_org'
  },
  {
    name:'指定部门及子部门',
    type:'specific_org_and_child'
  }
]
const userOptions = [
    {
      name:'当前用户',
      type:'curr_user'
    },
    {
      name:'指定用户',
      type:'specific_user'
    },
    {
      name:'当前用户所在部门的用户',
      type:'curr_org'
    },
    {
      name:'当前用户所在部门及子部门的用户',
      type:'curr_org_and_child'
    },
    {
      name:'指定部门的用户',
      type:'specific_org'
    },
    {
      name:'指定部门及子部门的用户',
      type:'specific_org_and_child'
    }
]
const showBaseTypeData = [
    {
      value:'String',
      text:'String',
      dasType:'string',
      eosDataType:'String',
      columnType:'VARCHAR',
      label:'text'
    },
    {
      value:'Int',
      text:'Int',
      dasType:'int',
      eosDataType:'Int',
      columnType:'INT',
      label:'number'
    },
    {
      value:'BigInteger',
      text:'BigInteger',
      dasType:'big_integer',
      eosDataType:'Integer',
      columnType:'DECIMAL',
      label:'number'
    },
    {
      value:'Float',
      text:'Float',
      dasType:'float',
      eosDataType:'Float',
      columnType:'FLOAT',
      label:'number'
    },
    {
      value:'Long',
      text:'Long',
      dasType:'long',
      eosDataType:'Long',
      columnType:'BIGINT',
      label:'number'
    },
    {
      value:'Double',
      text:'Double',
      dasType:'double',
      eosDataType:'Double',
      columnType:'DOUBLE',
      label:'number'
    },
    {
      value:'Decimal',
      text:'Decimal',
      dasType:'big_decimal',
      eosDataType:'Decimal',
      columnType:'DECIMAL',
      label:'number'
    },
    {
      value:'Boolean',
      text:'Boolean',
      dasType:'boolean',
      eosDataType:'Boolean',
      columnType:'BIT',
      label:'text'
    },
    {
      value:'Date',
      text:'Date',
      dasType:'date',
      eosDataType:'Date',
      columnType:'DATE',
      label:'date'
    },
    {
      value:'Time',
      text:'Time',
      dasType:'timeString',
      eosDataType:'Time',
      columnType:'TIME',
      label:'time'
    },
    {
      value:'TimeStamp',
      text:'TimeStamp',
      dasType:'timestamp',
      eosDataType:'Date',
      columnType:'DATETIME',
      label:'date'
    },
    {
      value:'ClobString',
      text:'ClobString',
      dasType:'com.primeton.das.entity.impl.lob.type.ClobStringType',
      eosDataType:'String',
      columnType:'TEXT',
      label:'text'
    },
    {
      value:'BlobByteArray',
      text:'BlobByteArray',
      dasType:'com.primeton.das.entity.impl.lob.type.BlobByteArrayType',
      eosDataType:'Bytes',
      columnType:'BLOB',
      label:'text'
    },
    {
      value:'ClobFile',
      text:'ClobFile',
      dasType:'com.primeton.das.entity.impl.lob.type.ClobFileType',
      eosDataType:'String',
      columnType:'TEXT',
      label:'text'
    },
    {
      value:'BlobFile',
      text:'BlobFile',
      dasType:'com.primeton.das.entity.impl.lob.type.BlobFileType',
      eosDataType:'String',
      columnType:'BLOB',
      label:'text'
    },
    {
      value:'Byte',
      text:'Byte',
      dasType:'byte',
      eosDataType:'Byte',
      columnType:'TINYINT',
      label:'number'
    },
    {
      value:'Short',
      text:'Short',
      dasType:'short',
      eosDataType:'Short',
      columnType:'SMALLINT',
      label:'number'
    }
  ]
const dataType = {
    'Integer':'Int',
    'BigDecimal':'Decimal',
    'Blob':'BlobByteArray',
    'Bytes':'BlobByteArray'
  }
const propertyTypeOptions = [
  { type:'constant',name:'常量',disabled:false },
  { type:'dict',name:'业务字典',disabled:false },
  { type:'entity',name:'实体',disabled:false },
  { type:'org',name:'组织',disabled:false }
]
export {
  operators,
  condition,
  showBaseTypeData,
  numberOperators,
  dateOperators,
  textOperators,
  orgOptions,
  userOptions,
  propertyTypeOptions,
  propertySubOptions,
  dataType
}

