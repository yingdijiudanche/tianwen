var y=Object.defineProperty,T=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var p=(a,t,e)=>t in a?y(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,n=(a,t)=>{for(var e in t||(t={}))I.call(t,e)&&p(a,e,t[e]);if(c)for(var e of c(t))h.call(t,e)&&p(a,e,t[e]);return a},b=(a,t)=>T(a,E(t));import{R as l,m as o,G as S,H as x}from"./antd.6184fff2.js";import{a as f}from"./dayjs.min.39f03de2.js";import{r as k}from"./request.afec6a83.js";import{u as j}from"./useListPage.fe4e257c.js";import{u as v}from"./useSearchColumn.80e4a35f.js";import{I as i}from"./index.7faa062c.js";import{b as m,a as g}from"./tableHelp.374439ae.js";var N={getList:(a,t)=>k.get("inout/list",{params:a,cancelToken:t})};const C={0:"normal",1:"abnormal",2:"error"},Y={0:"driver",1:"visitor",2:"other"},V=()=>({selectedKeys:a,setSelectedKeys:t,confirm:e})=>l.createElement(o,{options:[{label:"IN",value:"IN"},{label:"OUT",value:"OUT"}],style:{width:"100%"},value:a,onSelect:s=>{t([s]),e()},placeholder:"Click to select"}),H=()=>({selectedKeys:a,setSelectedKeys:t,confirm:e})=>l.createElement(o,{options:[{label:"normal",value:"0"},{label:"abnormal",value:"1"},{label:"error",value:"2"}],style:{width:"100%"},value:a,onSelect:s=>{t([s]),e()},placeholder:"Click to select"}),M=()=>({selectedKeys:a,setSelectedKeys:t,confirm:e})=>l.createElement(o,{options:[{label:"driver",value:"0"},{label:"visitor",value:"1"},{label:"other",value:"2"}],style:{width:"100%"},value:a,onSelect:s=>{t([s]),e()},placeholder:"Click to select"}),U=()=>{var u,d;const{dataState:a,handleTableChange:t,cachedParams:e}=j(N),s=[n({title:l.createElement(i,{id:"inout.event"}),dataIndex:"event",key:"~event",filteredValue:e["~event"]},m(V())),n({title:l.createElement(i,{id:"inout.status"}),dataIndex:"status",key:"status",render:r=>C[r],filteredValue:e.status},m(H())),n({title:l.createElement(i,{id:"inout.type"}),dataIndex:"type",key:"type",render:r=>Y[r],filteredValue:e.type},m(M())),n({title:l.createElement(i,{id:"inout.licenceNumber"}),dataIndex:"licenceNumber",key:"~licenceNumber",filteredValue:e["~licenceNumber"]},v("licenceNumber")),n({title:l.createElement(i,{id:"inout.msg"}),dataIndex:"msg",key:"~msg",filteredValue:e["~msg"]},v("msg")),n({title:l.createElement(i,{id:"inout.scanningTime"}),dataIndex:"scanningTime",key:"#scanningTime",sorter:!0,sortOrder:(u=e.sort)==null?void 0:u.scanningTime,render:r=>f(r).format("YYYY-MM-DD HH:mm"),filteredValue:e["#scanningTime"]},g()),n({title:l.createElement(i,{id:"inout.passingTime"}),dataIndex:"passingTime",key:"#passingTime",sorter:!0,sortOrder:(d=e.sort)==null?void 0:d.passingTime,render:r=>f(r).format("YYYY-MM-DD HH:mm"),filteredValue:e["#passingTime"]},g()),{title:l.createElement(i,{id:"inout.driver"}),dataIndex:"permit",render:r=>{if(r&&r.type===1)return r.admin.driverName}}];return l.createElement(S,{title:l.createElement(i,{id:"table.list",values:{menu:"In Out"}})},l.createElement(x,b(n({},a),{className:"gx-table-responsive",columns:s,rowKey:"_id",onChange:t})))};export{U as default};
//# sourceMappingURL=index.683563d2.js.map
