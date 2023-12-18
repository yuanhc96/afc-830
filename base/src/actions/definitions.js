export default {
  "AppApplication": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/AppApplication"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.framework.application.AppApplication"
  },
  "AppFuncgroup": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/AppFuncgroup"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.framework.application.AppFuncgroup"
  },
  "AppFunction": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/AppFunction"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.framework.application.AppFunction"
  },
  "AppMenu": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/AppMenu"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.framework.application.AppMenu"
  },
  "ArrayList": {
    "type": "object",
    "properties": {
      "DEFAULTCAPACITY_EMPTY_ELEMENTDATA": {
        "type": "array",
        "description": "DEFAULTCAPACITY_EMPTY_ELEMENTDATA",
        "items": {
          "type": "object"
        }
      },
      "DEFAULT_CAPACITY": {
        "type": "integer",
        "format": "int32",
        "description": "DEFAULT_CAPACITY"
      },
      "EMPTY_ELEMENTDATA": {
        "type": "array",
        "description": "EMPTY_ELEMENTDATA",
        "items": {
          "type": "object"
        }
      },
      "MAX_ARRAY_SIZE": {
        "type": "integer",
        "format": "int32",
        "description": "MAX_ARRAY_SIZE"
      },
      "elementData": {
        "type": "array",
        "description": "elementData",
        "items": {
          "type": "object"
        }
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "size": {
        "type": "integer",
        "format": "int32",
        "description": "size"
      }
    },
    "title": "java.util.ArrayList"
  },
  "Associate": {
    "type": "object",
    "properties": {
      "ASSOCIATE_TYPE_11": {
        "type": "string",
        "description": "ASSOCIATE_TYPE_11"
      },
      "ASSOCIATE_TYPE_1N": {
        "type": "string",
        "description": "ASSOCIATE_TYPE_1N"
      },
      "ASSOCIATE_TYPE_B1N": {
        "type": "string",
        "description": "ASSOCIATE_TYPE_B1N"
      },
      "ASSOCIATE_TYPE_N1": {
        "type": "string",
        "description": "ASSOCIATE_TYPE_N1"
      },
      "associateFields": {
        "type": "array",
        "description": "associateFields",
        "items": {
          "$ref": "#/definitions/AssociateField"
        }
      },
      "associateType": {
        "type": "string",
        "description": "associateType"
      },
      "description": {
        "type": "string",
        "description": "description"
      },
      "destEntityName": {
        "type": "string",
        "description": "destEntityName"
      },
      "destId": {
        "type": "string",
        "description": "destId"
      },
      "destIdInSrc": {
        "type": "string",
        "description": "destIdInSrc"
      },
      "destTableName": {
        "type": "string",
        "description": "destTableName"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "srcEntityName": {
        "type": "string",
        "description": "srcEntityName"
      },
      "srcId": {
        "type": "string",
        "description": "srcId"
      },
      "srcIdInDest": {
        "type": "string",
        "description": "srcIdInDest"
      },
      "srcTableName": {
        "type": "string",
        "description": "srcTableName"
      }
    },
    "title": "com.primeton.cap.spi.dataset.model.Associate"
  },
  "AssociateField": {
    "type": "object",
    "properties": {
      "destColumnName": {
        "type": "string",
        "description": "destColumnName"
      },
      "srcColumnName": {
        "type": "string",
        "description": "srcColumnName"
      }
    },
    "title": "com.primeton.cap.spi.dataset.model.AssociateField"
  },
  "BizCatalog": {
    "type": "object",
    "properties": {
      "catalogName": {
        "type": "string",
        "description": "catalogName"
      },
      "catalogUUID": {
        "type": "string",
        "description": "catalogUUID"
      },
      "expanded": {
        "type": "boolean",
        "description": "expanded"
      },
      "img": {
        "type": "string",
        "description": "img"
      },
      "isLeaf": {
        "type": "boolean",
        "description": "isLeaf"
      },
      "parentCatalogUUID": {
        "type": "string",
        "description": "parentCatalogUUID"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      }
    },
    "title": "org.gocom.bps.wfclient.process.BizCatalog"
  },
  "BizResource": {
    "type": "object",
    "properties": {
      "resourceID": {
        "type": "string",
        "description": "resourceID"
      },
      "resourceName": {
        "type": "string",
        "description": "resourceName"
      },
      "resourceType": {
        "type": "string",
        "description": "resourceType"
      }
    },
    "title": "com.primeton.workflow.api2.model.BizResource"
  },
  "CapRole": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/CapRole"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.rights.dataset.CapRole"
  },
  "CapUser": {
    "type": "object",
    "properties": {
      "authmode": {
        "type": "string",
        "description": "authmode"
      },
      "createtime": {
        "type": "string",
        "format": "date-time",
        "description": "createtime"
      },
      "createuser": {
        "type": "string",
        "description": "createuser"
      },
      "email": {
        "type": "string",
        "description": "email"
      },
      "enddate": {
        "type": "string",
        "format": "date-time",
        "description": "enddate"
      },
      "errcount": {
        "type": "number",
        "description": "errcount"
      },
      "invaldate": {
        "type": "string",
        "format": "date-time",
        "description": "invaldate"
      },
      "ipaddress": {
        "type": "string",
        "description": "ipaddress"
      },
      "lastlogin": {
        "type": "string",
        "format": "date-time",
        "description": "lastlogin"
      },
      "maccode": {
        "type": "string",
        "description": "maccode"
      },
      "menutype": {
        "type": "string",
        "description": "menutype"
      },
      "operatorId": {
        "type": "number",
        "description": "operatorId"
      },
      "password": {
        "type": "string",
        "description": "password"
      },
      "startdate": {
        "type": "string",
        "format": "date-time",
        "description": "startdate"
      },
      "status": {
        "type": "string",
        "description": "status"
      },
      "tenantId": {
        "type": "string",
        "description": "tenantId"
      },
      "unlocktime": {
        "type": "string",
        "format": "date-time",
        "description": "unlocktime"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      },
      "userName": {
        "type": "string",
        "description": "userName"
      },
      "validtime": {
        "type": "string",
        "description": "validtime"
      }
    },
    "title": "org.gocom.components.coframe.rights.dataset.CapUser"
  },
  "ConValue": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "value": {
        "type": "string",
        "description": "value"
      }
    },
    "title": "org.gocom.components.coframe.entityauth.pojo.ConValue"
  },
  "Condition": {
    "type": "object",
    "properties": {
      "children": {
        "type": "array",
        "description": "children",
        "items": {
          "$ref": "#/definitions/Condition"
        }
      },
      "condition": {
        "type": "string",
        "description": "condition"
      },
      "extension": {
        "type": "array",
        "description": "extension",
        "items": {
          "$ref": "#/definitions/RuleConditionDefinition$Property"
        }
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "leftId": {
        "type": "string",
        "description": "leftId"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "operator": {
        "type": "string",
        "description": "operator"
      },
      "rightId": {
        "type": "string",
        "description": "rightId"
      }
    },
    "title": "org.gocom.components.coframe.entityauth.pojo.Condition"
  },
  "DataObject": {
    "type": "object",
    "title": "commonj.sdo.DataObject"
  },
  "DictEntry": {
    "type": "object",
    "properties": {
      "children": {
        "description": "children",
        "$ref": "#/definitions/DictEntry"
      },
      "dictID": {
        "type": "string",
        "description": "dictID"
      },
      "dictName": {
        "type": "string",
        "description": "dictName"
      },
      "filter1": {
        "type": "string",
        "description": "filter1"
      },
      "filter2": {
        "type": "string",
        "description": "filter2"
      },
      "level": {
        "type": "integer",
        "format": "int32",
        "description": "level"
      },
      "parent": {
        "description": "parent",
        "$ref": "#/definitions/DictEntry"
      },
      "rank": {
        "type": "integer",
        "format": "int32",
        "description": "rank"
      },
      "seqNo": {
        "type": "string",
        "description": "seqNo"
      },
      "sortNo": {
        "type": "integer",
        "format": "int32",
        "description": "sortNo"
      },
      "status": {
        "type": "integer",
        "format": "int32",
        "description": "status"
      }
    },
    "title": "com.eos.foundation.DictEntry"
  },
  "DownloadFile": {
    "type": "object",
    "properties": {
      "contentType": {
        "type": "string",
        "description": "contentType"
      },
      "outputFileName": {
        "type": "string",
        "description": "outputFileName"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      }
    },
    "title": "com.primeton.ext.access.http.DownloadFile"
  },
  "EmpGroupParam": {
    "type": "object",
    "properties": {
      "appid": {
        "type": "string",
        "description": "appid"
      },
      "empid": {
        "type": "number",
        "description": "empid"
      },
      "groupid": {
        "type": "number",
        "description": "groupid"
      },
      "ismain": {
        "type": "string",
        "description": "ismain"
      },
      "orgEmployee": {
        "description": "orgEmployee",
        "$ref": "#/definitions/OrgEmployee"
      },
      "tenantid": {
        "type": "string",
        "description": "tenantid"
      }
    },
    "title": "org.gocom.components.coframe.org.util.EmpGroupParam"
  },
  "Entity": {
    "type": "object",
    "properties": {
      "ENTITY_TYPE_NENTITY": {
        "type": "string",
        "description": "ENTITY_TYPE_NENTITY"
      },
      "ENTITY_TYPE_PENTITY": {
        "type": "string",
        "description": "ENTITY_TYPE_PENTITY"
      },
      "ENTITY_TYPE_QENTITY": {
        "type": "string",
        "description": "ENTITY_TYPE_QENTITY"
      },
      "ENTITY_TYPE_RENTITY": {
        "type": "string",
        "description": "ENTITY_TYPE_RENTITY"
      },
      "associates": {
        "type": "array",
        "description": "associates",
        "items": {
          "$ref": "#/definitions/Associate"
        }
      },
      "createTable": {
        "type": "boolean",
        "description": "createTable"
      },
      "description": {
        "type": "string",
        "description": "description"
      },
      "dropTable": {
        "type": "boolean",
        "description": "dropTable"
      },
      "entityType": {
        "type": "string",
        "description": "entityType"
      },
      "fields": {
        "type": "array",
        "description": "fields",
        "items": {
          "$ref": "#/definitions/Field"
        }
      },
      "formType": {
        "type": "string",
        "description": "formType"
      },
      "genStrategy": {
        "type": "string",
        "description": "genStrategy"
      },
      "height": {
        "type": "integer",
        "format": "int32",
        "description": "height"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "label": {
        "type": "string",
        "description": "label"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "nameSpace": {
        "type": "string",
        "description": "nameSpace"
      },
      "queryView": {
        "type": "string",
        "description": "queryView"
      },
      "querysql": {
        "type": "string",
        "description": "querysql"
      },
      "schema": {
        "type": "string",
        "description": "schema"
      },
      "tableName": {
        "type": "string",
        "description": "tableName"
      },
      "width": {
        "type": "integer",
        "format": "int32",
        "description": "width"
      },
      "x": {
        "type": "integer",
        "format": "int32",
        "description": "x"
      },
      "y": {
        "type": "integer",
        "format": "int32",
        "description": "y"
      }
    },
    "title": "com.primeton.cap.spi.dataset.model.Entity"
  },
  "EntityInfo": {
    "type": "object",
    "properties": {
      "ENTITY_TYPE_P": {
        "type": "integer",
        "format": "int32",
        "description": "ENTITY_TYPE_P"
      },
      "ENTITY_TYPE_Q": {
        "type": "integer",
        "format": "int32",
        "description": "ENTITY_TYPE_Q"
      },
      "ENTITY_TYPE_R": {
        "type": "integer",
        "format": "int32",
        "description": "ENTITY_TYPE_R"
      },
      "entity": {
        "description": "entity",
        "$ref": "#/definitions/Entity"
      },
      "entityType": {
        "type": "integer",
        "format": "int32",
        "description": "entityType"
      }
    },
    "title": "com.primeton.cap.spi.dataset.service.EntityInfo"
  },
  "EosDictEntry": {
    "type": "object",
    "properties": {
      "dictid": {
        "type": "string",
        "description": "dictid"
      },
      "dictname": {
        "type": "string",
        "description": "dictname"
      },
      "eosDictType": {
        "description": "eosDictType",
        "$ref": "#/definitions/EosDictType"
      },
      "filter1": {
        "type": "string",
        "description": "filter1"
      },
      "filter2": {
        "type": "string",
        "description": "filter2"
      },
      "parentid": {
        "type": "string",
        "description": "parentid"
      },
      "rank": {
        "type": "integer",
        "format": "int32",
        "description": "rank"
      },
      "seqno": {
        "type": "string",
        "description": "seqno"
      },
      "sortno": {
        "type": "integer",
        "format": "int32",
        "description": "sortno"
      },
      "status": {
        "type": "integer",
        "format": "int32",
        "description": "status"
      }
    },
    "title": "org.gocom.components.coframe.dict.dict.EosDictEntry"
  },
  "EosDictType": {
    "type": "object",
    "properties": {
      "dicttypeid": {
        "type": "string",
        "description": "dicttypeid"
      },
      "dicttypename": {
        "type": "string",
        "description": "dicttypename"
      },
      "parentid": {
        "type": "string",
        "description": "parentid"
      },
      "rank": {
        "type": "integer",
        "format": "int32",
        "description": "rank"
      },
      "seqno": {
        "type": "string",
        "description": "seqno"
      },
      "tenantId": {
        "type": "string",
        "description": "tenantId"
      }
    },
    "title": "EosDictType"
  },
  "FielUpload": {
    "type": "object",
    "properties": {
      "clientFileName": {
        "type": "string",
        "description": "clientFileName"
      },
      "clientPath": {
        "type": "string",
        "description": "clientPath"
      },
      "contentType": {
        "type": "string",
        "description": "contentType"
      },
      "fileData": {
        "description": "fileData",
        "$ref": "#/definitions/[B"
      },
      "fileId": {
        "type": "string",
        "description": "fileId"
      },
      "fileName": {
        "type": "string",
        "description": "fileName"
      },
      "filePath": {
        "type": "string",
        "description": "filePath"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "saveType": {
        "type": "integer",
        "format": "int32",
        "description": "saveType"
      },
      "size": {
        "type": "integer",
        "format": "int64",
        "description": "size"
      },
      "uploadTime": {
        "type": "string",
        "format": "date-time",
        "description": "uploadTime"
      },
      "uploadUser": {
        "type": "string",
        "description": "uploadUser"
      }
    },
    "title": "com.primeton.components.web.fileupload.ds_fileupload.FielUpload"
  },
  "Field": {
    "type": "object",
    "properties": {
      "PERSIST_TYPE_C": {
        "type": "string",
        "description": "PERSIST_TYPE_C"
      },
      "PERSIST_TYPE_N": {
        "type": "string",
        "description": "PERSIST_TYPE_N"
      },
      "PERSIST_TYPE_P": {
        "type": "string",
        "description": "PERSIST_TYPE_P"
      },
      "PERSIST_TYPE_R": {
        "type": "string",
        "description": "PERSIST_TYPE_R"
      },
      "columnName": {
        "type": "string",
        "description": "columnName"
      },
      "columnType": {
        "type": "string",
        "description": "columnType"
      },
      "description": {
        "type": "string",
        "description": "description"
      },
      "eosShowType": {
        "type": "string",
        "description": "eosShowType"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "index": {
        "type": "integer",
        "format": "int32",
        "description": "index"
      },
      "length": {
        "type": "integer",
        "format": "int32",
        "description": "length"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "nullAble": {
        "type": "boolean",
        "description": "nullAble"
      },
      "persistType": {
        "type": "string",
        "description": "persistType"
      },
      "precision": {
        "type": "integer",
        "format": "int32",
        "description": "precision"
      },
      "primaryKey": {
        "type": "boolean",
        "description": "primaryKey"
      }
    },
    "title": "com.primeton.cap.spi.dataset.model.Field"
  },
  "FormField": {
    "type": "object",
    "properties": {
      "accessType": {
        "type": "string",
        "description": "accessType"
      },
      "dataType": {
        "type": "string",
        "description": "dataType"
      },
      "defaultValue": {
        "type": "string",
        "description": "defaultValue"
      },
      "description": {
        "type": "string",
        "description": "description"
      },
      "fieldAttribute": {
        "type": "string",
        "description": "fieldAttribute"
      },
      "fieldType": {
        "type": "string",
        "description": "fieldType"
      },
      "htmlComponentCode": {
        "type": "string",
        "description": "htmlComponentCode"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "path": {
        "type": "string",
        "description": "path"
      },
      "required": {
        "type": "boolean",
        "description": "required"
      },
      "value": {
        "type": "string",
        "description": "value"
      },
      "variableName": {
        "description": "variableName",
        "$ref": "#/definitions/BizResource"
      }
    },
    "title": "com.primeton.workflow.api2.model.FormField"
  },
  "IPAccessRules": {
    "type": "object",
    "properties": {
      "addDate": {
        "type": "string",
        "description": "addDate"
      },
      "enabled": {
        "type": "string",
        "description": "enabled"
      },
      "endIP": {
        "type": "string",
        "description": "endIP"
      },
      "makersId": {
        "type": "string",
        "description": "makersId"
      },
      "remark": {
        "type": "string",
        "description": "remark"
      },
      "rulesId": {
        "type": "string",
        "description": "rulesId"
      },
      "rulesType": {
        "type": "string",
        "description": "rulesType"
      },
      "startIP": {
        "type": "string",
        "description": "startIP"
      },
      "tenantId": {
        "type": "string",
        "description": "tenantId"
      }
    },
    "title": "org.gocom.components.coframe.policy.datas.IPAccessRules"
  },
  "IRuleConditionSet": {
    "type": "object",
    "title": "com.primeton.cap.spi.auth.rule.IRuleConditionSet"
  },
  "Object": {
    "type": "object",
    "title": "java.lang.Object"
  },
  "OrgEmpgroup": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgEmpgroup"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.groupdataset.OrgEmpgroup"
  },
  "OrgEmployee": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgEmployee"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.dataset.OrgEmployee"
  },
  "OrgEmpposition": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgEmpposition"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.dataset.OrgEmpposition"
  },
  "OrgGroup": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgGroup"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.groupdataset.OrgGroup"
  },
  "OrgGroupposi": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgGroupposi"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.groupdataset.OrgGroupposi"
  },
  "OrgOrganization": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgOrganization"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.dataset.OrgOrganization"
  },
  "OrgPosition": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgPosition"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.dataset.OrgPosition"
  },
  "OrgResponse": {
    "type": "object",
    "properties": {
      "flag": {
        "type": "boolean",
        "description": "flag"
      },
      "message": {
        "type": "string",
        "description": "message"
      }
    },
    "title": "org.gocom.components.coframe.org.util.OrgResponse"
  },
  "OrgTreeNode": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/OrgTreeNode"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.org.dataset.OrgTreeNode"
  },
  "PageCond": {
    "type": "object",
    "properties": {
      "begin": {
        "type": "integer",
        "format": "int32",
        "description": "begin"
      },
      "beginIndex": {
        "type": "integer",
        "format": "int32",
        "description": "beginIndex"
      },
      "currentPage": {
        "type": "integer",
        "format": "int32",
        "description": "currentPage"
      },
      "isCount": {
        "type": "boolean",
        "description": "isCount"
      },
      "isFirst": {
        "type": "boolean",
        "description": "isFirst"
      },
      "isLast": {
        "type": "boolean",
        "description": "isLast"
      },
      "length": {
        "type": "integer",
        "format": "int32",
        "description": "length"
      },
      "totalCount": {
        "type": "integer",
        "format": "int32",
        "description": "totalCount"
      },
      "totalPage": {
        "type": "integer",
        "format": "int32",
        "description": "totalPage"
      }
    },
    "title": "com.primeton.workflow.api2.model.PageCond"
  },
  "Participant": {
    "type": "object",
    "properties": {
      "participantID": {
        "type": "string",
        "description": "participantID"
      },
      "participantName": {
        "type": "string",
        "description": "participantName"
      },
      "participantType": {
        "type": "string",
        "description": "participantType"
      }
    },
    "title": "com.primeton.workflow.api2.model.Participant"
  },
  "Party": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
        "description": "code"
      },
      "extAttributes": {
        "type": "object",
        "description": "extAttributes",
        "additionalProperties": {
          "type": "string"
        }
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "partyTypeID": {
        "type": "string",
        "description": "partyTypeID"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "tenantID": {
        "type": "string",
        "description": "tenantID"
      }
    },
    "title": "com.primeton.cap.party.Party"
  },
  "ProActInfo": {
    "type": "object",
    "properties": {
      "accessType": {
        "type": "string",
        "description": "accessType"
      },
      "itemID": {
        "type": "string",
        "description": "itemID"
      },
      "itemName": {
        "type": "string",
        "description": "itemName"
      },
      "itemType": {
        "type": "string",
        "description": "itemType"
      },
      "proDefID": {
        "type": "string",
        "description": "proDefID"
      },
      "proFullName": {
        "type": "string",
        "description": "proFullName"
      }
    },
    "title": "org.gocom.bps.wfclient.agent.business.ProActInfo"
  },
  "PropertyInfo": {
    "type": "object",
    "properties": {
      "ASSOCIATIONTYPE_B1N": {
        "type": "integer",
        "format": "int32",
        "description": "ASSOCIATIONTYPE_B1N"
      },
      "ASSOCIATIONTYPE_NONE": {
        "type": "integer",
        "format": "int32",
        "description": "ASSOCIATIONTYPE_NONE"
      },
      "ASSOCIATIONTYPE_U11": {
        "type": "integer",
        "format": "int32",
        "description": "ASSOCIATIONTYPE_U11"
      },
      "ASSOCIATIONTYPE_U1N": {
        "type": "integer",
        "format": "int32",
        "description": "ASSOCIATIONTYPE_U1N"
      },
      "ASSOCIATIONTYPE_UN1": {
        "type": "integer",
        "format": "int32",
        "description": "ASSOCIATIONTYPE_UN1"
      },
      "PROPERTY_TYPE_N": {
        "type": "integer",
        "format": "int32",
        "description": "PROPERTY_TYPE_N"
      },
      "PROPERTY_TYPE_P": {
        "type": "integer",
        "format": "int32",
        "description": "PROPERTY_TYPE_P"
      },
      "associate": {
        "description": "associate",
        "$ref": "#/definitions/Associate"
      },
      "associationType": {
        "type": "integer",
        "format": "int32",
        "description": "associationType"
      },
      "container": {
        "description": "container",
        "$ref": "#/definitions/Entity"
      },
      "field": {
        "description": "field",
        "$ref": "#/definitions/Field"
      },
      "hierarchialLevel": {
        "type": "integer",
        "format": "int32",
        "description": "hierarchialLevel"
      },
      "hierarchialName": {
        "type": "string",
        "description": "hierarchialName"
      },
      "propertyType": {
        "type": "integer",
        "format": "int32",
        "description": "propertyType"
      }
    },
    "title": "com.primeton.cap.spi.dataset.service.PropertyInfo"
  },
  "RecentVisit": {
    "type": "object",
    "properties": {
      "frequency": {
        "type": "integer",
        "format": "int32",
        "description": "frequency"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "lasttime": {
        "type": "string",
        "format": "date-time",
        "description": "lasttime"
      },
      "targetId": {
        "type": "string",
        "description": "targetId"
      },
      "targetType": {
        "type": "string",
        "description": "targetType"
      },
      "userid": {
        "type": "string",
        "description": "userid"
      }
    },
    "title": "org.gocom.components.coframe.participantselect.dataset.RecentVisit"
  },
  "ResultBean": {
    "type": "object",
    "properties": {
      "data": {
        "type": "object",
        "description": "data"
      },
      "msg": {
        "type": "string",
        "description": "msg"
      },
      "result": {
        "type": "boolean",
        "description": "result"
      }
    },
    "title": "org.gocom.components.coframe.core.tenant.tools.ResultBean"
  },
  "RightValue": {
    "type": "object",
    "properties": {
      "expression": {
        "type": "string",
        "description": "expression"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      }
    },
    "title": "org.gocom.components.coframe.entityauth.pojo.RightValue"
  },
  "Rule": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "namespace": {
        "type": "string",
        "description": "namespace"
      },
      "rootCondition": {
        "description": "rootCondition",
        "$ref": "#/definitions/IRuleConditionSet"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "tenantId": {
        "type": "string",
        "description": "tenantId"
      },
      "type": {
        "type": "string",
        "description": "type"
      }
    },
    "title": "com.primeton.cap.spi.auth.rule.Rule"
  },
  "RuleAndAuth": {
    "type": "object",
    "properties": {
      "auth": {
        "type": "string",
        "description": "auth"
      },
      "authIconFlag": {
        "type": "string",
        "description": "authIconFlag"
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "namespace": {
        "type": "string",
        "description": "namespace"
      },
      "rootCondition": {
        "description": "rootCondition",
        "$ref": "#/definitions/IRuleConditionSet"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "tenantId": {
        "type": "string",
        "description": "tenantId"
      },
      "type": {
        "type": "string",
        "description": "type"
      }
    },
    "title": "org.gocom.components.coframe.entityauth.pojo.RuleAndAuth"
  },
  "RuleConditionDefinition$Property": {
    "type": "object",
    "properties": {
      "key": {
        "type": "string",
        "description": "key"
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "value": {
        "description": "value",
        "$ref": "#/definitions/Serializable"
      }
    },
    "title": "com.primeton.cap.spi.auth.rule.RuleConditionDefinition$Property"
  },
  "Serializable": {
    "type": "object",
    "title": "java.io.Serializable"
  },
  "Tenant": {
    "type": "object",
    "properties": {
      "FACTORY": {
        "type": "array",
        "description": "FACTORY",
        "items": {
          "$ref": "#/definitions/Tenant"
        }
      },
      "QNAME": {
        "type": "string",
        "description": "QNAME"
      },
      "TYPE": {
        "description": "TYPE",
        "$ref": "#/definitions/Type"
      }
    },
    "title": "org.gocom.components.coframe.core.tenant.dataset.Tenant"
  },
  "Type": {
    "type": "object",
    "title": "commonj.sdo.Type"
  },
  "UploadFile": {
    "type": "object",
    "properties": {
      "clientPath": {
        "type": "string",
        "description": "clientPath"
      },
      "fieldName": {
        "type": "string",
        "description": "fieldName"
      }
    },
    "title": "com.primeton.ext.access.http.UploadFile"
  },
  "UserObject": {
    "type": "object",
    "properties": {
      "attributes": {
        "type": "object",
        "description": "attributes",
        "additionalProperties": {
          "type": "object"
        }
      },
      "serialVersionUID": {
        "type": "integer",
        "format": "int64",
        "description": "serialVersionUID"
      },
      "sessionId": {
        "type": "string",
        "description": "sessionId"
      },
      "uniqueId": {
        "type": "string",
        "description": "uniqueId"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      },
      "userMail": {
        "type": "string",
        "description": "userMail"
      },
      "userName": {
        "type": "string",
        "description": "userName"
      },
      "userOrgId": {
        "type": "string",
        "description": "userOrgId"
      },
      "userOrgName": {
        "type": "string",
        "description": "userOrgName"
      },
      "userRealName": {
        "type": "string",
        "description": "userRealName"
      },
      "userRemoteIP": {
        "type": "string",
        "description": "userRemoteIP"
      }
    },
    "title": "com.eos.data.datacontext.UserObject"
  },
  "WFActivityDefine": {
    "type": "object",
    "properties": {
      "allowAgent": {
        "type": "string",
        "description": "allowAgent"
      },
      "allowAppoint": {
        "type": "boolean",
        "description": "allowAppoint"
      },
      "appointedParticipants": {
        "type": "array",
        "description": "appointedParticipants",
        "items": {
          "$ref": "#/definitions/Participant"
        }
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "isSpecifyURL": {
        "type": "boolean",
        "description": "isSpecifyURL"
      },
      "joinMode": {
        "type": "string",
        "description": "joinMode"
      },
      "multiWorkItem": {
        "type": "boolean",
        "description": "multiWorkItem"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "participantType": {
        "type": "string",
        "description": "participantType"
      },
      "participants": {
        "type": "array",
        "description": "participants",
        "items": {
          "$ref": "#/definitions/Participant"
        }
      },
      "priority": {
        "type": "string",
        "description": "priority"
      },
      "processDefId": {
        "type": "integer",
        "format": "int64",
        "description": "processDefId"
      },
      "reStartUrlID": {
        "type": "string",
        "description": "reStartUrlID"
      },
      "reStartUrlType": {
        "type": "string",
        "description": "reStartUrlType"
      },
      "splitMode": {
        "type": "string",
        "description": "splitMode"
      },
      "subProcess": {
        "type": "boolean",
        "description": "subProcess"
      },
      "subProcessDefName": {
        "type": "string",
        "description": "subProcessDefName"
      },
      "type": {
        "type": "string",
        "description": "type"
      },
      "urlID": {
        "type": "string",
        "description": "urlID"
      },
      "urlType": {
        "type": "string",
        "description": "urlType"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFActivityDefine"
  },
  "WFBizCatalog": {
    "type": "object",
    "properties": {
      "PERM_0": {
        "type": "string",
        "description": "PERM_0"
      },
      "PERM_1": {
        "type": "string",
        "description": "PERM_1"
      },
      "PERM_2": {
        "type": "string",
        "description": "PERM_2"
      },
      "PERM_3": {
        "type": "string",
        "description": "PERM_3"
      },
      "PERM_4": {
        "type": "string",
        "description": "PERM_4"
      },
      "catalogName": {
        "type": "string",
        "description": "catalogName"
      },
      "catalogUUID": {
        "type": "string",
        "description": "catalogUUID"
      },
      "demo": {
        "type": "string",
        "description": "demo"
      },
      "directFlag": {
        "type": "string",
        "description": "directFlag"
      },
      "isLeaf": {
        "type": "string",
        "description": "isLeaf"
      },
      "orderID": {
        "type": "integer",
        "format": "int32",
        "description": "orderID"
      },
      "parentCatalogUUID": {
        "type": "string",
        "description": "parentCatalogUUID"
      },
      "permisssionMap": {
        "type": "object",
        "description": "permisssionMap",
        "additionalProperties": {
          "type": "string"
        }
      },
      "seq": {
        "type": "string",
        "description": "seq"
      },
      "uptTime": {
        "type": "string",
        "description": "uptTime"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFBizCatalog"
  },
  "WFMessage": {
    "type": "object",
    "properties": {
      "actDefID": {
        "type": "string",
        "description": "actDefID"
      },
      "actInstID": {
        "type": "string",
        "description": "actInstID"
      },
      "content": {
        "type": "string",
        "description": "content"
      },
      "extendAttrs": {
        "type": "object",
        "description": "extendAttrs",
        "additionalProperties": {
          "type": "object"
        }
      },
      "from": {
        "type": "string",
        "description": "from"
      },
      "index": {
        "type": "string",
        "description": "index"
      },
      "operateType": {
        "type": "string",
        "description": "operateType"
      },
      "time": {
        "type": "string",
        "description": "time"
      },
      "workItemID": {
        "type": "string",
        "description": "workItemID"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFMessage"
  },
  "WFOptMsg": {
    "type": "object",
    "properties": {
      "content": {
        "type": "string",
        "description": "content"
      },
      "correlationID": {
        "type": "integer",
        "format": "int64",
        "description": "correlationID"
      },
      "correlationType": {
        "type": "string",
        "description": "correlationType"
      },
      "createTime": {
        "type": "string",
        "description": "createTime"
      },
      "messageID": {
        "type": "integer",
        "format": "int64",
        "description": "messageID"
      },
      "operationType": {
        "type": "string",
        "description": "operationType"
      },
      "processDefID": {
        "type": "integer",
        "format": "int64",
        "description": "processDefID"
      },
      "processInstID": {
        "type": "integer",
        "format": "int64",
        "description": "processInstID"
      },
      "producer": {
        "type": "string",
        "description": "producer"
      },
      "receiver": {
        "type": "string",
        "description": "receiver"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFOptMsg"
  },
  "WFParticipant": {
    "type": "object",
    "properties": {
      "attributes": {
        "type": "object",
        "description": "attributes",
        "additionalProperties": {
          "type": "object"
        }
      },
      "id": {
        "type": "string",
        "description": "id"
      },
      "name": {
        "type": "string",
        "description": "name"
      },
      "typeCode": {
        "type": "string",
        "description": "typeCode"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFParticipant"
  },
  "WFProcessDefine": {
    "type": "object",
    "properties": {
      "catalogUUID": {
        "type": "string",
        "description": "catalogUUID"
      },
      "createTime": {
        "type": "string",
        "description": "createTime"
      },
      "currentFlag": {
        "type": "string",
        "description": "currentFlag"
      },
      "currentState": {
        "type": "integer",
        "format": "int32",
        "description": "currentState"
      },
      "description": {
        "type": "string",
        "description": "description"
      },
      "hasActiveInstance": {
        "type": "string",
        "description": "hasActiveInstance"
      },
      "longProcess": {
        "type": "string",
        "description": "longProcess"
      },
      "operator": {
        "type": "string",
        "description": "operator"
      },
      "packageID": {
        "type": "string",
        "description": "packageID"
      },
      "packageName": {
        "type": "string",
        "description": "packageName"
      },
      "processChName": {
        "type": "string",
        "description": "processChName"
      },
      "processDefID": {
        "type": "integer",
        "format": "int64",
        "description": "processDefID"
      },
      "processDefName": {
        "type": "string",
        "description": "processDefName"
      },
      "processDefOwner": {
        "type": "string",
        "description": "processDefOwner"
      },
      "updateTime": {
        "type": "string",
        "description": "updateTime"
      },
      "versionDesc": {
        "type": "string",
        "description": "versionDesc"
      },
      "versionSign": {
        "type": "string",
        "description": "versionSign"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFProcessDefine"
  },
  "WFProcessInst": {
    "type": "object",
    "properties": {
      "catalogName": {
        "type": "string",
        "description": "catalogName"
      },
      "catalogUUID": {
        "type": "string",
        "description": "catalogUUID"
      },
      "createTime": {
        "type": "string",
        "description": "createTime"
      },
      "creator": {
        "type": "string",
        "description": "creator"
      },
      "currentState": {
        "type": "integer",
        "format": "int32",
        "description": "currentState"
      },
      "endTime": {
        "type": "string",
        "description": "endTime"
      },
      "finalTime": {
        "type": "string",
        "description": "finalTime"
      },
      "isTimeOut": {
        "type": "string",
        "description": "isTimeOut"
      },
      "limitNum": {
        "type": "integer",
        "format": "int64",
        "description": "limitNum"
      },
      "limitNumDesc": {
        "type": "string",
        "description": "limitNumDesc"
      },
      "owner": {
        "type": "string",
        "description": "owner"
      },
      "parentActID": {
        "type": "integer",
        "format": "int64",
        "description": "parentActID"
      },
      "parentProcID": {
        "type": "integer",
        "format": "int64",
        "description": "parentProcID"
      },
      "priority": {
        "type": "integer",
        "format": "int32",
        "description": "priority"
      },
      "processDefID": {
        "type": "integer",
        "format": "int64",
        "description": "processDefID"
      },
      "processDefName": {
        "type": "string",
        "description": "processDefName"
      },
      "processInstDesc": {
        "type": "string",
        "description": "processInstDesc"
      },
      "processInstID": {
        "type": "integer",
        "format": "int64",
        "description": "processInstID"
      },
      "processInstName": {
        "type": "string",
        "description": "processInstName"
      },
      "remindTime": {
        "type": "string",
        "description": "remindTime"
      },
      "startTime": {
        "type": "string",
        "description": "startTime"
      },
      "timeOutNum": {
        "type": "integer",
        "format": "int32",
        "description": "timeOutNum"
      },
      "timeOutNumDesc": {
        "type": "string",
        "description": "timeOutNumDesc"
      },
      "updateVersion": {
        "type": "string",
        "description": "updateVersion"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFProcessInst"
  },
  "WFWorkItem": {
    "type": "object",
    "properties": {
      "actionMask": {
        "type": "string",
        "description": "actionMask"
      },
      "actionURL": {
        "type": "string",
        "description": "actionURL"
      },
      "activityDefID": {
        "type": "string",
        "description": "activityDefID"
      },
      "activityInstID": {
        "type": "integer",
        "format": "int64",
        "description": "activityInstID"
      },
      "activityInstName": {
        "type": "string",
        "description": "activityInstName"
      },
      "allowAgent": {
        "type": "string",
        "description": "allowAgent"
      },
      "assistant": {
        "type": "string",
        "description": "assistant"
      },
      "assistantName": {
        "type": "string",
        "description": "assistantName"
      },
      "bizObject": {
        "type": "object",
        "description": "bizObject",
        "additionalProperties": {
          "type": "object"
        }
      },
      "bizState": {
        "type": "integer",
        "format": "int32",
        "description": "bizState"
      },
      "catalogName": {
        "type": "string",
        "description": "catalogName"
      },
      "catalogUUID": {
        "type": "string",
        "description": "catalogUUID"
      },
      "createTime": {
        "type": "string",
        "description": "createTime"
      },
      "currentState": {
        "type": "integer",
        "format": "int32",
        "description": "currentState"
      },
      "dealOpinion": {
        "type": "string",
        "description": "dealOpinion"
      },
      "dealResult": {
        "type": "string",
        "description": "dealResult"
      },
      "endTime": {
        "type": "string",
        "description": "endTime"
      },
      "finalTime": {
        "type": "string",
        "description": "finalTime"
      },
      "isTimeOut": {
        "type": "string",
        "description": "isTimeOut"
      },
      "limitNum": {
        "type": "integer",
        "format": "int64",
        "description": "limitNum"
      },
      "limitNumDesc": {
        "type": "string",
        "description": "limitNumDesc"
      },
      "partiName": {
        "type": "string",
        "description": "partiName"
      },
      "participant": {
        "type": "string",
        "description": "participant"
      },
      "participants": {
        "type": "array",
        "description": "participants",
        "items": {
          "$ref": "#/definitions/WFParticipant"
        }
      },
      "pressNum": {
        "type": "integer",
        "format": "int32",
        "description": "pressNum"
      },
      "priority": {
        "type": "integer",
        "format": "int32",
        "description": "priority"
      },
      "processChName": {
        "type": "string",
        "description": "processChName"
      },
      "processDefID": {
        "type": "integer",
        "format": "int64",
        "description": "processDefID"
      },
      "processDefName": {
        "type": "string",
        "description": "processDefName"
      },
      "processInstID": {
        "type": "integer",
        "format": "int64",
        "description": "processInstID"
      },
      "processInstName": {
        "type": "string",
        "description": "processInstName"
      },
      "remindTime": {
        "type": "string",
        "description": "remindTime"
      },
      "rootProcInstID": {
        "type": "integer",
        "format": "int64",
        "description": "rootProcInstID"
      },
      "startTime": {
        "type": "string",
        "description": "startTime"
      },
      "statesList": {
        "type": "string",
        "description": "statesList"
      },
      "timeOutNum": {
        "type": "integer",
        "format": "int32",
        "description": "timeOutNum"
      },
      "timeOutNumDesc": {
        "type": "string",
        "description": "timeOutNumDesc"
      },
      "urlType": {
        "type": "string",
        "description": "urlType"
      },
      "workItemDesc": {
        "type": "string",
        "description": "workItemDesc"
      },
      "workItemID": {
        "type": "integer",
        "format": "int64",
        "description": "workItemID"
      },
      "workItemName": {
        "type": "string",
        "description": "workItemName"
      },
      "workItemType": {
        "type": "string",
        "description": "workItemType"
      }
    },
    "title": "com.primeton.workflow.api2.model.WFWorkItem"
  },
  "Win7AutoStart": {
    "type": "object",
    "properties": {
      "menuId": {
        "type": "string",
        "description": "menuId"
      },
      "startDesc": {
        "type": "string",
        "description": "startDesc"
      },
      "startId": {
        "type": "string",
        "description": "startId"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      }
    },
    "title": "org.gocom.components.coframe.skins.win7.data.Win7AutoStart"
  },
  "Win7Config": {
    "type": "object",
    "properties": {
      "bgPicturePath": {
        "type": "string",
        "description": "bgPicturePath"
      },
      "configData": {
        "type": "string",
        "description": "configData"
      },
      "configId": {
        "type": "string",
        "description": "configId"
      },
      "defaultHeight": {
        "type": "integer",
        "format": "int32",
        "description": "defaultHeight"
      },
      "defaultMax": {
        "type": "boolean",
        "description": "defaultMax"
      },
      "defaultWidth": {
        "type": "integer",
        "format": "int32",
        "description": "defaultWidth"
      },
      "deskStyle": {
        "type": "string",
        "description": "deskStyle"
      },
      "ext1": {
        "type": "string",
        "description": "ext1"
      },
      "ext2": {
        "type": "string",
        "description": "ext2"
      },
      "ext3": {
        "type": "string",
        "description": "ext3"
      },
      "openType": {
        "type": "string",
        "description": "openType"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      }
    },
    "title": "org.gocom.components.coframe.skins.win7.data.Win7Config"
  },
  "Win7CustomPictures": {
    "type": "object",
    "properties": {
      "customId": {
        "type": "string",
        "description": "customId"
      },
      "fileName": {
        "type": "string",
        "description": "fileName"
      },
      "uploadTime": {
        "type": "string",
        "description": "uploadTime"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      }
    },
    "title": "org.gocom.components.coframe.skins.win7.data.Win7CustomPictures"
  },
  "Win7Icons": {
    "type": "object",
    "properties": {
      "iconDesc": {
        "type": "string",
        "description": "iconDesc"
      },
      "iconId": {
        "type": "string",
        "description": "iconId"
      },
      "iconName": {
        "type": "string",
        "description": "iconName"
      },
      "iconOrder": {
        "type": "string",
        "description": "iconOrder"
      },
      "iconPath": {
        "type": "string",
        "description": "iconPath"
      },
      "iconText": {
        "type": "string",
        "description": "iconText"
      },
      "iconTitle": {
        "type": "string",
        "description": "iconTitle"
      },
      "menuId": {
        "type": "string",
        "description": "menuId"
      },
      "userId": {
        "type": "string",
        "description": "userId"
      }
    },
    "title": "org.gocom.components.coframe.skins.win7.data.Win7Icons"
  },
  "array": {
    "type": "object",
    "title": "java.util.List"
  },
  "criteriaType": {
    "type": "object",
    "properties": {
      "_and": {
        "description": "_and",
        "$ref": "#/definitions/logicType"
      },
      "_association": {
        "type": "string",
        "description": "_association"
      },
      "_distinct": {
        "type": "boolean",
        "description": "_distinct"
      },
      "_entity": {
        "type": "string",
        "description": "_entity"
      },
      "_expr": {
        "description": "_expr",
        "$ref": "#/definitions/exprType"
      },
      "_group": {
        "type": "string",
        "description": "_group"
      },
      "_lock": {
        "type": "string",
        "description": "_lock"
      },
      "_not": {
        "description": "_not",
        "$ref": "#/definitions/logicType"
      },
      "_or": {
        "description": "_or",
        "$ref": "#/definitions/logicType"
      },
      "_order": {
        "description": "_order",
        "$ref": "#/definitions/orderType"
      },
      "_orderby": {
        "description": "_orderby",
        "$ref": "#/definitions/orderbyType"
      },
      "_ref": {
        "description": "_ref",
        "$ref": "#/definitions/refType"
      },
      "_select": {
        "description": "_select",
        "$ref": "#/definitions/selectType"
      }
    },
    "title": "com.primeton.das.criteria.criteriaType"
  },
  "exprType": {
    "type": "object",
    "properties": {
      "_dateRule": {
        "type": "string",
        "description": "_dateRule"
      },
      "_likeRule": {
        "type": "string",
        "description": "_likeRule"
      },
      "_max": {
        "type": "string",
        "description": "_max"
      },
      "_min": {
        "type": "string",
        "description": "_min"
      },
      "_month": {
        "type": "string",
        "description": "_month"
      },
      "_op": {
        "type": "string",
        "description": "_op"
      },
      "_opProperty": {
        "type": "string",
        "description": "_opProperty"
      },
      "_pattern": {
        "type": "string",
        "description": "_pattern"
      },
      "_processNullValue": {
        "type": "string",
        "description": "_processNullValue"
      },
      "_property": {
        "type": "string",
        "description": "_property"
      },
      "_quarter": {
        "type": "string",
        "description": "_quarter"
      },
      "_ref": {
        "type": "string",
        "description": "_ref"
      },
      "_value": {
        "type": "string",
        "description": "_value"
      },
      "_year": {
        "type": "string",
        "description": "_year"
      }
    },
    "title": "exprType"
  },
  "logicType": {
    "type": "object",
    "properties": {
      "_and": {
        "description": "_and",
        "$ref": "#/definitions/logicType"
      },
      "_expr": {
        "description": "_expr",
        "$ref": "#/definitions/exprType"
      },
      "_not": {
        "description": "_not",
        "$ref": "#/definitions/logicType"
      },
      "_or": {
        "description": "_or",
        "$ref": "#/definitions/logicType"
      }
    },
    "title": "logicType"
  },
  "orderType": {
    "type": "object",
    "properties": {
      "_asc": {
        "type": "string",
        "description": "_asc"
      },
      "_desc": {
        "type": "string",
        "description": "_desc"
      }
    },
    "title": "orderType"
  },
  "orderbyType": {
    "type": "object",
    "properties": {
      "_property": {
        "type": "string",
        "description": "_property"
      },
      "_sort": {
        "type": "string",
        "description": "_sort"
      }
    },
    "title": "orderbyType"
  },
  "refType": {
    "type": "object",
    "properties": {
      "_and": {
        "description": "_and",
        "$ref": "#/definitions/logicType"
      },
      "_entity": {
        "type": "string",
        "description": "_entity"
      },
      "_expr": {
        "description": "_expr",
        "$ref": "#/definitions/exprType"
      },
      "_id": {
        "type": "string",
        "description": "_id"
      },
      "_not": {
        "description": "_not",
        "$ref": "#/definitions/logicType"
      },
      "_or": {
        "description": "_or",
        "$ref": "#/definitions/logicType"
      },
      "_select": {
        "description": "_select",
        "$ref": "#/definitions/selectType"
      }
    },
    "title": "refType"
  },
  "selectType": {
    "type": "object",
    "properties": {
      "_avg": {
        "type": "string",
        "description": "_avg"
      },
      "_count": {
        "type": "string",
        "description": "_count"
      },
      "_field": {
        "type": "string",
        "description": "_field"
      },
      "_max": {
        "type": "string",
        "description": "_max"
      },
      "_min": {
        "type": "string",
        "description": "_min"
      },
      "_sum": {
        "type": "string",
        "description": "_sum"
      }
    },
    "title": "selectType"
  }
}