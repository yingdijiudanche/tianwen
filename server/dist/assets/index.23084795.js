var h=Object.defineProperty,N=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable;var f=(i,t,r)=>t in i?h(i,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[t]=r,s=(i,t)=>{for(var r in t||(t={}))b.call(t,r)&&f(i,r,t[r]);if(u)for(var r of u(t))v.call(t,r)&&f(i,r,t[r]);return i},p=(i,t)=>N(i,E(t));import{R as e,G as x,H as j}from"./antd.6184fff2.js";import{a as D}from"./dayjs.min.39f03de2.js";import{a as I}from"./index.72ed9d92.js";import{u as k}from"./useListPage.fe4e257c.js";import{u as l}from"./useSearchColumn.80e4a35f.js";import{I as a}from"./index.7faa062c.js";import{M as g,D as B,A as M}from"./operateBtns.7f848e8e.js";import"./request.afec6a83.js";import"./styled-components.browser.esm.a560c53e.js";const U=()=>{var d,c;const{dataState:i,handleTableChange:t,deleOne:r,cachedParams:n}=k(I),y=[{title:e.createElement(a,{id:"table.operation"}),dataIndex:"sort",key:"operation",render:(m,o)=>e.createElement("div",{style:{display:"flex"}},e.createElement(g,{carry:{editData:o}}),e.createElement(B,{onConfirm:r(o._id)}))},s({title:e.createElement(a,{id:"vehicle.licenceNumber"}),dataIndex:"licenceNumber",key:"~licenceNumber",sorter:!0,sortOrder:(d=n.sort)==null?void 0:d.licenceNumber,filteredValue:n["~licenceNumber"]},l("licenceNumber")),s({title:e.createElement(a,{id:"vehicle.chassisNumber"}),dataIndex:"chassisNumber",key:"~chassisNumber",filteredValue:n["~chassisNumber"]},l("chassisNumber")),s({title:e.createElement(a,{id:"vehicle.department"}),dataIndex:"department",key:"~department",filteredValue:n["~department"]},l("department")),{title:e.createElement(a,{id:"vehicle.contractingBusinessDept"}),dataIndex:"contractingBusinessDept",key:"~contractingBusinessDept"},{title:e.createElement(a,{id:"vehicle.type"}),dataIndex:"VRDBodyType",key:"~VRDBodyType"},{title:e.createElement(a,{id:"vehicle.carModel"}),dataIndex:"carModel",key:"~carModel"},{title:e.createElement(a,{id:"vehicle.driverName"}),dataIndex:"driverName",key:"~driverName"},{title:e.createElement(a,{id:"vehicle.GPSUnitNo"}),dataIndex:"GPSUnitNo",key:"~GPSUnitNo"},{title:e.createElement(a,{id:"vehicle.projectNo"}),dataIndex:"projectNo",key:"~projectNo"},{title:e.createElement(a,{id:"vehicle.status"}),dataIndex:"status",key:"~status"},{title:e.createElement(a,{id:"vehicle.effDateFrom"}),dataIndex:"effDateFrom",key:"~effDateFrom",sorter:!0,sortOrder:(c=n.sort)==null?void 0:c.effDateFrom,render:m=>D(m).format("YYYY-MM-DD")}];return e.createElement(x,{title:e.createElement(a,{id:"table.list",values:{menu:"Vehicle"}})},e.createElement(M,null),e.createElement(j,p(s({},i),{className:"gx-table-responsive",columns:y,rowKey:"_id",onChange:t})))};export{U as default};
//# sourceMappingURL=index.23084795.js.map
