export default {
    group:{
        id: null,
        name: null,
        code: null,
        types: null,
        resType: null,
        description: null,
        appId: null,
        businessObjId: null,
        tenantId: null,
        sortNo:1
    },
    resource:{
        id:null,
        name:null,
        code:null,
        types:null,
        appId:null,
        resGroupId:null,
        subType:null,
        description:null,
        businessObjId:null,
        content: null,
        tenantId:null
    },
    dataResource:{
        id:null,
        name:null,
        code:null,
        types:null,
        appId:null,
        resGroupId:null,
        subType:null,
        description:null,
        businessObjId:null,
        content:{
            entityName:'',
            rowLevel:{
                or:{ nodes:[] },
                and:{ nodes:[] },
            },
            columnLevel:{
                refEntityPropertyNames:{},
                propertyNames:''
            }
        },
        tenantId:null
    }
}
