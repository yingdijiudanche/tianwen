import{r as n,R as e,G as p,H as u,o as l}from"./antd.6184fff2.js";import{d as y,I as r,s as E}from"./index.7faa062c.js";import{a as g}from"./dayjs.min.39f03de2.js";import{a as o}from"./index.29ab49bc.js";import{A as x,M as j,D as I}from"./operateBtns.7f848e8e.js";import"./request.afec6a83.js";import"./styled-components.browser.esm.a560c53e.js";const A=()=>{const[d,m]=n.exports.useState([]),i=y(),c=t=>async()=>{let a=await o.dele(t);if(a.code)return l.error(a.msg);l.success(a.msg),s()},s=async()=>{let t=await o.getAll();if(t.code)return i(E("error",t.msg,"Error",4.5,null));m(t.data)};n.exports.useEffect(()=>{s()},[]);const f=[{title:e.createElement(r,{id:"table.operation"}),dataIndex:"sort",key:"operation",render:(t,a)=>e.createElement("div",{style:{display:"flex"}},e.createElement(j,{carry:{editData:a}}),e.createElement(I,{onConfirm:c(a._id)}))},{title:e.createElement(r,{id:"role.name"}),dataIndex:"name",key:"name"},{title:e.createElement(r,{id:"role.menuIds"}),align:"center",dataIndex:"menuIds",key:"menuIds",render:t=>t.length?t.length:e.createElement(r,{id:"role.all"})},{title:e.createElement(r,{id:"role.addTime"}),dataIndex:"addTime",key:"addTime",render:t=>g(t).format("YYYY-MM-DD HH:mm:ss")}];return e.createElement(p,{title:e.createElement(r,{id:"table.list",values:{menu:"Role"}})},e.createElement(x,null),e.createElement(u,{className:"gx-table-responsive",columns:f,dataSource:d,rowKey:"_id"}))};export{A as default};
//# sourceMappingURL=index.98c1f8f6.js.map
