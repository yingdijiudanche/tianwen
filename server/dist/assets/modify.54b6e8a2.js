var w=Object.defineProperty,C=Object.defineProperties;var j=Object.getOwnPropertyDescriptors;var E=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var g=(r,a,e)=>a in r?w(r,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[a]=e,i=(r,a)=>{for(var e in a||(a={}))F.call(a,e)&&g(r,e,a[e]);if(E)for(var e of E(a))I.call(a,e)&&g(r,e,a[e]);return r},M=(r,a)=>C(r,j(a));import{F as d,r as b,R as t,G as q,m as B,I as o,ax as S,B as k,o as u}from"./antd.6184fff2.js";import{a as N}from"./index.7faa062c.js";import{m as f}from"./index.26ad1fd1.js";import"./request.afec6a83.js";const s=d.Item,R={labelCol:{span:4},wrapperCol:{span:12}},A={wrapperCol:{span:8,offset:4}},D=({location:r,history:a,intl:e})=>{const{editData:l}=r.state||{},c=l!==void 0,[p]=d.useForm(),[h,y]=b.exports.useState([]);b.exports.useEffect(()=>{(async()=>{let n=await f.options();if(n.code)return u.error(n.msg);y(n.data)})(),c&&p.setFieldsValue(l)},[]);const x=async m=>{m.hidden||(m.hidden=!1);let n=c?await f.edit(l._id,m):await f.add(m);if(n.code)return u.error(n.msg);u.success(n.msg),a.goBack()};return t.createElement(q,{className:"gx-card",title:e.formatMessage({id:"menu.form"},{control:c?"Edit":"Create"})},t.createElement(d,M(i({},R),{form:p,name:"menu",onFinish:x,autoComplete:"off"}),t.createElement(s,{label:e.formatMessage({id:"menu.pid"}),name:"pid"},t.createElement(B,{placeholder:e.formatMessage({id:"placeholder.selector"}),options:h})),t.createElement(s,{label:e.formatMessage({id:"menu.name"}),name:"name",rules:[{required:!0}]},t.createElement(o,null)),t.createElement(s,{label:e.formatMessage({id:"menu.path"}),name:"path",rules:[{required:!0}]},t.createElement(o,null)),t.createElement(s,{label:e.formatMessage({id:"menu.icon"}),name:"icon"},t.createElement(o,null)),t.createElement(s,{label:e.formatMessage({id:"menu.sort"}),name:"sort",rules:[{required:!0}]},t.createElement(o,{type:"number"})),t.createElement(s,{label:e.formatMessage({id:"menu.component"}),name:"component"},t.createElement(o,null)),t.createElement(s,{label:e.formatMessage({id:"menu.hidden"}),name:"hidden",valuePropName:"checked"},t.createElement(S,null)),t.createElement(s,i({},A),t.createElement(k,{type:"primary",htmlType:"submit"},e.formatMessage({id:"buttons.submit"})))))};var _=N(D);export{_ as default};
//# sourceMappingURL=modify.54b6e8a2.js.map