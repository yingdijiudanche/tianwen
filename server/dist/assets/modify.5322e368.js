var k=Object.defineProperty,S=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var C=(c,r,a)=>r in c?k(c,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):c[r]=a,u=(c,r)=>{for(var a in r||(r={}))F.call(r,a)&&C(c,a,r[a]);if(M)for(var a of M(r))B.call(r,a)&&C(c,a,r[a]);return c},p=(c,r)=>S(c,P(r));import{F as h,r as y,R as e,G as O,au as w,av as t,I as n,m as s,ax as o,B as I,o as f}from"./antd.6184fff2.js";import{a as x}from"./index.7faa062c.js";import{a as N}from"./index.72ed9d92.js";import{a as A}from"./index.de6c1a24.js";import"./request.afec6a83.js";const l=h.Item,G={labelCol:{span:10},wrapperCol:{span:14}},Y=({location:c,history:r,intl:a})=>{const{editData:i}=c.state||{},d=i!==void 0,[g]=h.useForm(),[v,R]=y.exports.useState([]);y.exports.useEffect(()=>{if((async()=>{let m=await A.getOptions();if(m.code)return f.error(m.msg);R(m.data)})(),d){const m=p(u({},i),{typeOfCleaningServices:i.typeOfCleaningServices==="YES"});g.setFieldsValue(m)}},[]);const D=async b=>{let m=b;m.VRDBodyType||(m.VRDBodyType=v.find(V=>V.value===m.type).label);let E=d?await N.edit(i._id,m):await N.add(m);if(E.code)return f.error(E.msg);f.success(E.msg),r.goBack()};return e.createElement(O,{className:"gx-card",title:a.formatMessage({id:"vehicle.form"},{control:d?"Edit":"Create"})},e.createElement(h,p(u({form:g},G),{name:"vehicle",onFinish:D,autoComplete:"off",labelAlign:"left"}),e.createElement(w,{gutter:24,style:{width:"95%"}},e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.assetNo"}),name:"assetNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.renewalMonth"}),name:"renewalMonth"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.projectNo"}),name:"projectNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.licenceNumber"}),name:"licenceNumber",rules:[{required:!0}]},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.gearbox"}),name:"gearbox",rules:[{required:!0}]},e.createElement(s,{options:[{label:"Manual",value:1},{label:"Automatic",value:2}]}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.licenseRenewal"}),name:"licenseRenewal"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.company"}),name:"company"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDClass"}),name:"VRDClass"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.purposeOfVehicle"}),name:"purposeOfVehicle"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.department"}),name:"department"},e.createElement(s,{placeholder:a.formatMessage({id:"placeholder.selector"}),options:[{label:"BAF",value:"BAF"},{label:"BPD",value:"BPD"},{label:"CAF",value:"CAF"}]}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDMake"}),name:"VRDMake"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.cab"}),name:"cab"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.marketFunction"}),name:"marketFunction"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.carModel"}),name:"carModel"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.bodyBuild"}),name:"bodyBuild"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.branchLocation"}),name:"branchLocation"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.chassisNumber"}),name:"chassisNumber"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.groupLogo"}),name:"groupLogo",valuePropName:"checked",initialValue:!0},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.customerCode"}),name:"customerCode"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.engineNo"}),name:"engineNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.autotollAccount"}),name:"autotollAccount"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.subcontractorCode"}),name:"subcontractorCode"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDCylinderCapacity"}),name:"VRDCylinderCapacity"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.autotollCode"}),name:"autotollCode"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.autotollCode"}),name:"autotollCode"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.activityCode"}),name:"activityCode"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDColor"}),name:"VRDColor"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.GPSUnitNo"}),name:"GPSUnitNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.contractingBusinessDept"}),name:"contractingBusinessDept"},e.createElement(s,{placeholder:a.formatMessage({id:"placeholder.selector"}),options:[{label:"CBD",value:"CBD"},{label:"CCF",value:"CCF"},{label:"CSF",value:"CSF"}]}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDBodyType"}),name:"VRDBodyType"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.GPSInstallation"}),name:"GPSInstallation",valuePropName:"checked",initialValue:!0},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.nonOfficeHrAuth"}),name:"nonOfficeHrAuth"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDGrossWeight"}),name:"VRDGrossWeight"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.gasCardNo"}),name:"gasCardNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.typeOfParkingReinbursement"}),name:"typeOfParkingReinbursement",initialValue:"Normal"},e.createElement(s,{placeholder:a.formatMessage({id:"placeholder.selector"}),options:[{label:"Normal",value:"Normal"},{label:"Special",value:"Special"}]}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDYearOfManufacture"}),name:"VRDYearOfManufacture"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.driverName"}),name:"driverName"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.vehicleParkingLocation"}),name:"vehicleParkingLocation"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.dateOfFirstRegistration"}),name:"dateOfFirstRegistration"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.mainDriverStaffId"}),name:"mainDriverStaffId"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.typeOfCleaningServices"}),name:"typeOfCleaningServices",valuePropName:"checked"},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.VRDRegisteredOwner"}),name:"VRDRegisteredOwner"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.userGrading"}),name:"userGrading"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.emissionStandard"}),name:"emissionStandard"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.type"}),name:"type",rules:[{required:!0}]},e.createElement(s,{placeholder:a.formatMessage({id:"placeholder.selector"}),options:v}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.patronageRidership"}),name:"patronageRidership",rules:[{required:!0}]},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.charge"}),name:"charge",valuePropName:"checked",initialValue:!1},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.isSpare"}),name:"isSpare",valuePropName:"checked",initialValue:!1},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.isPoolCar"}),name:"isPoolCar",valuePropName:"checked"},e.createElement(o,{checkedChildren:"Yes",unCheckedChildren:"No"}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.maintenanceMileageDiff"}),name:"maintenanceMileageDiff"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.roadPermitNo"}),name:"roadPermitNo"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.vehicleFunction"}),name:"vehicleFunction"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.status"}),name:"status",initialValue:"In Use"},e.createElement(s,{placeholder:a.formatMessage({id:"placeholder.selector"}),options:[{label:"In Use",value:"In Use"},{label:"History",value:"History"},{label:"Scrapped",value:"Scrapped"}]}))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.allocationCoding"}),name:"allocationCoding"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.roundedMonthlyRate"}),name:"roundedMonthlyRate"},e.createElement(n,null))),e.createElement(t,{span:8},e.createElement(l,{label:a.formatMessage({id:"vehicle.vehicleValue"}),name:"vehicleValue"},e.createElement(n,null)))),e.createElement(l,null,e.createElement(I,{type:"primary",htmlType:"submit"},a.formatMessage({id:"buttons.submit"})))))};var W=x(Y);export{W as default};
//# sourceMappingURL=modify.5322e368.js.map