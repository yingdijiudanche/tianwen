var p=Object.defineProperty,M=Object.defineProperties;var g=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable;var o=(l,t,a)=>t in l?p(l,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[t]=a,s=(l,t)=>{for(var a in t||(t={}))h.call(t,a)&&o(l,a,t[a]);if(m)for(var a of m(t))E.call(t,a)&&o(l,a,t[a]);return l},y=(l,t)=>M(l,g(t));import{R as e,E as f,G as v}from"./antd.fa9dc31e.js";import{a as x}from"./dayjs.min.9037223f.js";import{a as u}from"./index.e8062c45.js";import{u as P}from"./useListPage.af8924c6.js";import{I as r}from"./index.49e89548.js";import{M as T,D as I,A as k}from"./operateBtns.097c5cc4.js";import"./request.6e8ef974.js";import"./styled-components.browser.esm.342f67f5.js";const A=()=>{const{dataState:l,handleTableChange:t,deleOne:a,cachedParams:i}=P(u),c=[{title:e.createElement(r,{id:"table.operation"}),dataIndex:"sort",key:"operation",render:(n,d)=>e.createElement("div",{style:{display:"flex"}},e.createElement(T,{carry:{editData:d}}),e.createElement(I,{onConfirm:a(d._id)}))},{title:e.createElement(r,{id:"vehicleType.type"}),dataIndex:"type",key:"~type",filteredValue:i["~type"]},{title:e.createElement(r,{id:"vehicleType.mileagePerMonth"}),dataIndex:"mileagePerMonth",key:"~mileagePerMonth",filteredValue:i["~mileagePerMonth"]},{title:e.createElement(r,{id:"vehicleType.averageMileage"}),dataIndex:"averageMileage",key:"~averageMileage",filteredValue:i["~averageMileage"]},{title:e.createElement(r,{id:"vehicleType.minMoneyPerKM"}),dataIndex:"minMoneyPerKM",key:"~minMoneyPerKM"},{title:e.createElement(r,{id:"vehicleType.maxMoneyPerKM"}),dataIndex:"maxMoneyPerKM",key:"~maxMoneyPerKM"},{title:e.createElement(r,{id:"vehicleType.lastUpdateBy"}),dataIndex:"lastUpdateBy",key:"~lastUpdateBy"},{title:e.createElement(r,{id:"vehicleType.lastUpdateDate"}),dataIndex:"lastUpdateDate",key:"~lastUpdateDate",render:n=>x(n).format("YYYY-MM-DD")}];return e.createElement(f,{title:e.createElement(r,{id:"table.list",values:{menu:"Vehicle Type"}})},e.createElement(k,null),e.createElement(v,y(s({},l),{className:"gx-table-responsive",columns:c,rowKey:"_id",onChange:t})))};export{A as default};
//# sourceMappingURL=index.ae79d0d9.js.map
