//This file is automatically generated

 \{{#controllers}}
 // \{{this.tags}}
let \{{this.name}} = {
    __name: '\{{this.name}}',
    \{{#this.list}}
    \{{this.action}}: {controller: '\{{this.model}}' , method: '\{{this.action}}'}, // \{{this.summary}}
    \{{/this.list}}
};
 \{{/controllers}}

export {
 \{{#controllers}}
    \{{this.name}},
  \{{/controllers}}
};
