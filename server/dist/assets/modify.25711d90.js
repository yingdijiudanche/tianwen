var q=Object.defineProperty,R=Object.defineProperties;var V=Object.getOwnPropertyDescriptors;var L=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var w=(n,t,e)=>t in n?q(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,g=(n,t)=>{for(var e in t||(t={}))N.call(t,e)&&w(n,e,t[e]);if(L)for(var e of L(t))T.call(t,e)&&w(n,e,t[e]);return n},E=(n,t)=>R(n,V(t));import{F as y,x as v,r as C,R as c,G as z,I as H,ay as J,B as K,o as M}from"./antd.6184fff2.js";import{a as O}from"./index.7faa062c.js";import{s as A}from"./styled-components.browser.esm.a560c53e.js";import{a as I}from"./index.29ab49bc.js";import{m as P}from"./index.26ad1fd1.js";import"./request.afec6a83.js";const j=y.Item,S={labelCol:{span:4},wrapperCol:{span:12}},Q={wrapperCol:{span:8,offset:4}},U=A(v.Group)`
    padding-left: 23px;
    &>label{
        margin-right:20px;
        margin-top:5px
    }
`,W=A.div`
    flex:1;
    margin: 24px;
    &>div+div{
        margin-top:15px;
    }
`,X=function(n,t){let e=[];t.forEach(i=>{let o=n.find(_=>_._id===i);!o||e.push(o.name)});let m=e.length,r=n.length,u=m<r;return{checkedAll:m===r,checkList:e,indeterminate:u}},Y=(n=[],t=[])=>{let e=new Map;return t.filter(r=>n.includes(r._id)&&!r.pid).forEach(r=>{let u=t.filter(i=>i.pid===r._id),h=n.filter(i=>t.find(o=>i===o._id&&o.pid===r._id)),k=X(u,h);e.set(r._id,k)}),e},Z=({location:n,history:t,intl:e})=>{const{editData:m}=n.state||{},r=m!==void 0,[u]=y.useForm(),[h,k]=C.exports.useState([]),[i,o]=C.exports.useState();C.exports.useEffect(()=>{(async()=>{let s=await P.getAll();if(s.code)return M.error(s.msg);const l=Y(r?m.menuIds:[],s.data);o(l),k(s.data)})(),r&&u.setFieldsValue(m)},[]);const _=(a,s)=>({target:{checked:l}})=>{let p=l?{checkedAll:!0,checkList:s.map(d=>d.name),indeterminate:!1}:{checkedAll:!1,checkList:[],indeterminate:!1};l?i.set(a._id,p):i.delete(a._id),o(new Map(i))},F=(a,s)=>l=>{let p=l,d=p.length,f=s.length,x=d<f,b=d===f,G={checkedAll:b,checkList:p,indeterminate:x};!d&&x?i.delete(a._id):i.set(a._id,G),o(new Map(i))},B=a=>{let{checkedAll:s=!1,checkList:l=[],indeterminate:p=!1}=i.get(a._id)||{};const d=h.filter(f=>f.pid===a._id);return c.createElement("div",{key:a._id},c.createElement(v,{indeterminate:p,onChange:_(a,d),checked:s},a.name),c.createElement("div",null),c.createElement(U,{options:d.map(f=>f.name),value:l,onChange:F(a,d)}))},D=async a=>{let s=[];i.forEach(({checkList:p},d)=>{let f=p.map(x=>h.find(b=>b.name===x)._id);return s.push(d),s.push(...f)});let l=r?await I.edit(m._id,E(g({},a),{menuIds:s})):await I.add(E(g({},a),{menuIds:s}));if(l.code)return M.error(l.msg);M.success(l.msg),t.goBack()};return c.createElement(z,{className:"gx-card",title:e.formatMessage({id:"role.form"},{control:r?"Edit":"Create"})},c.createElement(y,E(g({},S),{form:u,name:"role",onFinish:D}),c.createElement(j,{label:e.formatMessage({id:"role.name"}),name:"name",rules:[{required:!0}]},c.createElement(H,null)),c.createElement(J,{orientation:"left"},e.formatMessage({id:"role.assign"})),c.createElement(W,g({},S),h.filter(a=>!a.pid).map(B)),c.createElement(j,g({},Q),c.createElement(K,{type:"primary",htmlType:"submit"},e.formatMessage({id:"buttons.submit"})))))};var ie=O(Z);export{ie as default};
//# sourceMappingURL=modify.25711d90.js.map