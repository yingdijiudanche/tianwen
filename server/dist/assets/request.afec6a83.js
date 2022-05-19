var z=Object.getOwnPropertySymbols;var we=Object.prototype.hasOwnProperty,Ee=Object.prototype.propertyIsEnumerable;var V=(r,e)=>{var t={};for(var n in r)we.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&z)for(var n of z(r))e.indexOf(n)<0&&Ee.call(r,n)&&(t[n]=r[n]);return t};import{b as xe,h as K}from"./index.7faa062c.js";import{o as Se}from"./antd.6184fff2.js";var T={exports:{}},W=function(e,t){return function(){for(var a=new Array(arguments.length),i=0;i<a.length;i++)a[i]=arguments[i];return e.apply(t,a)}},Oe=W,w=Object.prototype.toString;function U(r){return w.call(r)==="[object Array]"}function B(r){return typeof r=="undefined"}function Re(r){return r!==null&&!B(r)&&r.constructor!==null&&!B(r.constructor)&&typeof r.constructor.isBuffer=="function"&&r.constructor.isBuffer(r)}function Ce(r){return w.call(r)==="[object ArrayBuffer]"}function Ae(r){return typeof FormData!="undefined"&&r instanceof FormData}function je(r){var e;return typeof ArrayBuffer!="undefined"&&ArrayBuffer.isView?e=ArrayBuffer.isView(r):e=r&&r.buffer&&r.buffer instanceof ArrayBuffer,e}function $e(r){return typeof r=="string"}function Ne(r){return typeof r=="number"}function X(r){return r!==null&&typeof r=="object"}function R(r){if(w.call(r)!=="[object Object]")return!1;var e=Object.getPrototypeOf(r);return e===null||e===Object.prototype}function ke(r){return w.call(r)==="[object Date]"}function Pe(r){return w.call(r)==="[object File]"}function Te(r){return w.call(r)==="[object Blob]"}function G(r){return w.call(r)==="[object Function]"}function Ue(r){return X(r)&&G(r.pipe)}function Be(r){return typeof URLSearchParams!="undefined"&&r instanceof URLSearchParams}function De(r){return r.trim?r.trim():r.replace(/^\s+|\s+$/g,"")}function Le(){return typeof navigator!="undefined"&&(navigator.product==="ReactNative"||navigator.product==="NativeScript"||navigator.product==="NS")?!1:typeof window!="undefined"&&typeof document!="undefined"}function D(r,e){if(!(r===null||typeof r=="undefined"))if(typeof r!="object"&&(r=[r]),U(r))for(var t=0,n=r.length;t<n;t++)e.call(null,r[t],t,r);else for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&e.call(null,r[a],a,r)}function L(){var r={};function e(a,i){R(r[i])&&R(a)?r[i]=L(r[i],a):R(a)?r[i]=L({},a):U(a)?r[i]=a.slice():r[i]=a}for(var t=0,n=arguments.length;t<n;t++)D(arguments[t],e);return r}function qe(r,e,t){return D(e,function(a,i){t&&typeof a=="function"?r[i]=Oe(a,t):r[i]=a}),r}function Fe(r){return r.charCodeAt(0)===65279&&(r=r.slice(1)),r}var h={isArray:U,isArrayBuffer:Ce,isBuffer:Re,isFormData:Ae,isArrayBufferView:je,isString:$e,isNumber:Ne,isObject:X,isPlainObject:R,isUndefined:B,isDate:ke,isFile:Pe,isBlob:Te,isFunction:G,isStream:Ue,isURLSearchParams:Be,isStandardBrowserEnv:Le,forEach:D,merge:L,extend:qe,trim:De,stripBOM:Fe},E=h;function Q(r){return encodeURIComponent(r).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var Y=function(e,t,n){if(!t)return e;var a;if(n)a=n(t);else if(E.isURLSearchParams(t))a=t.toString();else{var i=[];E.forEach(t,function(s,m){s===null||typeof s=="undefined"||(E.isArray(s)?m=m+"[]":s=[s],E.forEach(s,function(c){E.isDate(c)?c=c.toISOString():E.isObject(c)&&(c=JSON.stringify(c)),i.push(Q(m)+"="+Q(c))}))}),a=i.join("&")}if(a){var o=e.indexOf("#");o!==-1&&(e=e.slice(0,o)),e+=(e.indexOf("?")===-1?"?":"&")+a}return e},He=h;function C(){this.handlers=[]}C.prototype.use=function(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:n?n.synchronous:!1,runWhen:n?n.runWhen:null}),this.handlers.length-1};C.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)};C.prototype.forEach=function(e){He.forEach(this.handlers,function(n){n!==null&&e(n)})};var Me=C,Ie=h,_e=function(e,t){Ie.forEach(e,function(a,i){i!==t&&i.toUpperCase()===t.toUpperCase()&&(e[t]=a,delete e[i])})},Z=function(e,t,n,a,i){return e.config=t,n&&(e.code=n),e.request=a,e.response=i,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e},Je=Z,ee=function(e,t,n,a,i){var o=new Error(e);return Je(o,t,n,a,i)},ze=ee,Ve=function(e,t,n){var a=n.config.validateStatus;!n.status||!a||a(n.status)?e(n):t(ze("Request failed with status code "+n.status,n.config,null,n.request,n))},A=h,Ke=A.isStandardBrowserEnv()?function(){return{write:function(t,n,a,i,o,u){var s=[];s.push(t+"="+encodeURIComponent(n)),A.isNumber(a)&&s.push("expires="+new Date(a).toGMTString()),A.isString(i)&&s.push("path="+i),A.isString(o)&&s.push("domain="+o),u===!0&&s.push("secure"),document.cookie=s.join("; ")},read:function(t){var n=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return n?decodeURIComponent(n[3]):null},remove:function(t){this.write(t,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}(),We=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)},Xe=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e},Ge=We,Qe=Xe,Ye=function(e,t){return e&&!Ge(t)?Qe(e,t):t},q=h,Ze=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],er=function(e){var t={},n,a,i;return e&&q.forEach(e.split(`
`),function(u){if(i=u.indexOf(":"),n=q.trim(u.substr(0,i)).toLowerCase(),a=q.trim(u.substr(i+1)),n){if(t[n]&&Ze.indexOf(n)>=0)return;n==="set-cookie"?t[n]=(t[n]?t[n]:[]).concat([a]):t[n]=t[n]?t[n]+", "+a:a}}),t},re=h,rr=re.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a"),n;function a(i){var o=i;return e&&(t.setAttribute("href",o),o=t.href),t.setAttribute("href",o),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:t.pathname.charAt(0)==="/"?t.pathname:"/"+t.pathname}}return n=a(window.location.href),function(o){var u=re.isString(o)?a(o):o;return u.protocol===n.protocol&&u.host===n.host}}():function(){return function(){return!0}}(),j=h,tr=Ve,nr=Ke,ar=Y,sr=Ye,ir=er,or=rr,F=ee,te=function(e){return new Promise(function(n,a){var i=e.data,o=e.headers,u=e.responseType;j.isFormData(i)&&delete o["Content-Type"];var s=new XMLHttpRequest;if(e.auth){var m=e.auth.username||"",g=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";o.Authorization="Basic "+btoa(m+":"+g)}var c=sr(e.baseURL,e.url);s.open(e.method.toUpperCase(),ar(c,e.params,e.paramsSerializer),!0),s.timeout=e.timeout;function f(){if(!!s){var b="getAllResponseHeaders"in s?ir(s.getAllResponseHeaders()):null,y=!u||u==="text"||u==="json"?s.responseText:s.response,S={data:y,status:s.status,statusText:s.statusText,headers:b,config:e,request:s};tr(n,a,S),s=null}}if("onloadend"in s?s.onloadend=f:s.onreadystatechange=function(){!s||s.readyState!==4||s.status===0&&!(s.responseURL&&s.responseURL.indexOf("file:")===0)||setTimeout(f)},s.onabort=function(){!s||(a(F("Request aborted",e,"ECONNABORTED",s)),s=null)},s.onerror=function(){a(F("Network Error",e,null,s)),s=null},s.ontimeout=function(){var y="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(y=e.timeoutErrorMessage),a(F(y,e,e.transitional&&e.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",s)),s=null},j.isStandardBrowserEnv()){var l=(e.withCredentials||or(c))&&e.xsrfCookieName?nr.read(e.xsrfCookieName):void 0;l&&(o[e.xsrfHeaderName]=l)}"setRequestHeader"in s&&j.forEach(o,function(y,S){typeof i=="undefined"&&S.toLowerCase()==="content-type"?delete o[S]:s.setRequestHeader(S,y)}),j.isUndefined(e.withCredentials)||(s.withCredentials=!!e.withCredentials),u&&u!=="json"&&(s.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&s.addEventListener("progress",e.onDownloadProgress),typeof e.onUploadProgress=="function"&&s.upload&&s.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(y){!s||(s.abort(),a(y),s=null)}),i||(i=null),s.send(i)})},d=h,ne=_e,ur=Z,lr={"Content-Type":"application/x-www-form-urlencoded"};function ae(r,e){!d.isUndefined(r)&&d.isUndefined(r["Content-Type"])&&(r["Content-Type"]=e)}function fr(){var r;return(typeof XMLHttpRequest!="undefined"||typeof process!="undefined"&&Object.prototype.toString.call(process)==="[object process]")&&(r=te),r}function cr(r,e,t){if(d.isString(r))try{return(e||JSON.parse)(r),d.trim(r)}catch(n){if(n.name!=="SyntaxError")throw n}return(t||JSON.stringify)(r)}var $={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:fr(),transformRequest:[function(e,t){return ne(t,"Accept"),ne(t,"Content-Type"),d.isFormData(e)||d.isArrayBuffer(e)||d.isBuffer(e)||d.isStream(e)||d.isFile(e)||d.isBlob(e)?e:d.isArrayBufferView(e)?e.buffer:d.isURLSearchParams(e)?(ae(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):d.isObject(e)||t&&t["Content-Type"]==="application/json"?(ae(t,"application/json"),cr(e)):e}],transformResponse:[function(e){var t=this.transitional,n=t&&t.silentJSONParsing,a=t&&t.forcedJSONParsing,i=!n&&this.responseType==="json";if(i||a&&d.isString(e)&&e.length)try{return JSON.parse(e)}catch(o){if(i)throw o.name==="SyntaxError"?ur(o,this,"E_JSON_PARSE"):o}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300}};$.headers={common:{Accept:"application/json, text/plain, */*"}};d.forEach(["delete","get","head"],function(e){$.headers[e]={}});d.forEach(["post","put","patch"],function(e){$.headers[e]=d.merge(lr)});var H=$,dr=h,pr=H,hr=function(e,t,n){var a=this||pr;return dr.forEach(n,function(o){e=o.call(a,e,t)}),e},se=function(e){return!!(e&&e.__CANCEL__)},ie=h,M=hr,mr=se,vr=H;function I(r){r.cancelToken&&r.cancelToken.throwIfRequested()}var yr=function(e){I(e),e.headers=e.headers||{},e.data=M.call(e,e.data,e.headers,e.transformRequest),e.headers=ie.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),ie.forEach(["delete","get","head","post","put","patch","common"],function(a){delete e.headers[a]});var t=e.adapter||vr.adapter;return t(e).then(function(a){return I(e),a.data=M.call(e,a.data,a.headers,e.transformResponse),a},function(a){return mr(a)||(I(e),a&&a.response&&(a.response.data=M.call(e,a.response.data,a.response.headers,e.transformResponse))),Promise.reject(a)})},p=h,oe=function(e,t){t=t||{};var n={},a=["url","method","data"],i=["headers","auth","proxy","params"],o=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],u=["validateStatus"];function s(f,l){return p.isPlainObject(f)&&p.isPlainObject(l)?p.merge(f,l):p.isPlainObject(l)?p.merge({},l):p.isArray(l)?l.slice():l}function m(f){p.isUndefined(t[f])?p.isUndefined(e[f])||(n[f]=s(void 0,e[f])):n[f]=s(e[f],t[f])}p.forEach(a,function(l){p.isUndefined(t[l])||(n[l]=s(void 0,t[l]))}),p.forEach(i,m),p.forEach(o,function(l){p.isUndefined(t[l])?p.isUndefined(e[l])||(n[l]=s(void 0,e[l])):n[l]=s(void 0,t[l])}),p.forEach(u,function(l){l in t?n[l]=s(e[l],t[l]):l in e&&(n[l]=s(void 0,e[l]))});var g=a.concat(i).concat(o).concat(u),c=Object.keys(e).concat(Object.keys(t)).filter(function(l){return g.indexOf(l)===-1});return p.forEach(c,m),n};const br="axios",gr="0.21.4",wr="Promise based HTTP client for the browser and node.js",Er="index.js",xr={test:"grunt test",start:"node ./sandbox/server.js",build:"NODE_ENV=production grunt build",preversion:"npm test",version:"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",postversion:"git push && git push --tags",examples:"node ./examples/server.js",coveralls:"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",fix:"eslint --fix lib/**/*.js"},Sr={type:"git",url:"https://github.com/axios/axios.git"},Or=["xhr","http","ajax","promise","node"],Rr="Matt Zabriskie",Cr="MIT",Ar={url:"https://github.com/axios/axios/issues"},jr="https://axios-http.com",$r={coveralls:"^3.0.0","es6-promise":"^4.2.4",grunt:"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1",karma:"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2",minimist:"^1.2.0",mocha:"^8.2.1",sinon:"^4.5.0","terser-webpack-plugin":"^4.2.3",typescript:"^4.0.5","url-search-params":"^0.10.0",webpack:"^4.44.2","webpack-dev-server":"^3.11.0"},Nr={"./lib/adapters/http.js":"./lib/adapters/xhr.js"},kr="dist/axios.min.js",Pr="dist/axios.min.js",Tr="./index.d.ts",Ur={"follow-redirects":"^1.14.0"},Br=[{path:"./dist/axios.min.js",threshold:"5kB"}];var Dr={name:br,version:gr,description:wr,main:Er,scripts:xr,repository:Sr,keywords:Or,author:Rr,license:Cr,bugs:Ar,homepage:jr,devDependencies:$r,browser:Nr,jsdelivr:kr,unpkg:Pr,typings:Tr,dependencies:Ur,bundlesize:Br},ue=Dr,_={};["object","boolean","number","function","string","symbol"].forEach(function(r,e){_[r]=function(n){return typeof n===r||"a"+(e<1?"n ":" ")+r}});var le={},Lr=ue.version.split(".");function fe(r,e){for(var t=e?e.split("."):Lr,n=r.split("."),a=0;a<3;a++){if(t[a]>n[a])return!0;if(t[a]<n[a])return!1}return!1}_.transitional=function(e,t,n){var a=t&&fe(t);function i(o,u){return"[Axios v"+ue.version+"] Transitional option '"+o+"'"+u+(n?". "+n:"")}return function(o,u,s){if(e===!1)throw new Error(i(u," has been removed in "+t));return a&&!le[u]&&(le[u]=!0,console.warn(i(u," has been deprecated since v"+t+" and will be removed in the near future"))),e?e(o,u,s):!0}};function qr(r,e,t){if(typeof r!="object")throw new TypeError("options must be an object");for(var n=Object.keys(r),a=n.length;a-- >0;){var i=n[a],o=e[i];if(o){var u=r[i],s=u===void 0||o(u,i,r);if(s!==!0)throw new TypeError("option "+i+" must be "+s);continue}if(t!==!0)throw Error("Unknown option "+i)}}var Fr={isOlderVersion:fe,assertOptions:qr,validators:_},ce=h,Hr=Y,de=Me,pe=yr,N=oe,he=Fr,x=he.validators;function O(r){this.defaults=r,this.interceptors={request:new de,response:new de}}O.prototype.request=function(e){typeof e=="string"?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=N(this.defaults,e),e.method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=e.transitional;t!==void 0&&he.assertOptions(t,{silentJSONParsing:x.transitional(x.boolean,"1.0.0"),forcedJSONParsing:x.transitional(x.boolean,"1.0.0"),clarifyTimeoutError:x.transitional(x.boolean,"1.0.0")},!1);var n=[],a=!0;this.interceptors.request.forEach(function(f){typeof f.runWhen=="function"&&f.runWhen(e)===!1||(a=a&&f.synchronous,n.unshift(f.fulfilled,f.rejected))});var i=[];this.interceptors.response.forEach(function(f){i.push(f.fulfilled,f.rejected)});var o;if(!a){var u=[pe,void 0];for(Array.prototype.unshift.apply(u,n),u=u.concat(i),o=Promise.resolve(e);u.length;)o=o.then(u.shift(),u.shift());return o}for(var s=e;n.length;){var m=n.shift(),g=n.shift();try{s=m(s)}catch(c){g(c);break}}try{o=pe(s)}catch(c){return Promise.reject(c)}for(;i.length;)o=o.then(i.shift(),i.shift());return o};O.prototype.getUri=function(e){return e=N(this.defaults,e),Hr(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")};ce.forEach(["delete","get","head","options"],function(e){O.prototype[e]=function(t,n){return this.request(N(n||{},{method:e,url:t,data:(n||{}).data}))}});ce.forEach(["post","put","patch"],function(e){O.prototype[e]=function(t,n,a){return this.request(N(a||{},{method:e,url:t,data:n}))}});var Mr=O;function J(r){this.message=r}J.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")};J.prototype.__CANCEL__=!0;var me=J,Ir=me;function k(r){if(typeof r!="function")throw new TypeError("executor must be a function.");var e;this.promise=new Promise(function(a){e=a});var t=this;r(function(a){t.reason||(t.reason=new Ir(a),e(t.reason))})}k.prototype.throwIfRequested=function(){if(this.reason)throw this.reason};k.source=function(){var e,t=new k(function(a){e=a});return{token:t,cancel:e}};var _r=k,Jr=function(e){return function(n){return e.apply(null,n)}},zr=function(e){return typeof e=="object"&&e.isAxiosError===!0},ve=h,Vr=W,P=Mr,Kr=oe,Wr=H;function ye(r){var e=new P(r),t=Vr(P.prototype.request,e);return ve.extend(t,P.prototype,e),ve.extend(t,e),t}var v=ye(Wr);v.Axios=P;v.create=function(e){return ye(Kr(v.defaults,e))};v.Cancel=me;v.CancelToken=_r;v.isCancel=se;v.all=function(e){return Promise.all(e)};v.spread=Jr;v.isAxiosError=zr;T.exports=v;T.exports.default=v;var Xr=T.exports;const Gr=[{name:"search",rule:/^~/,format:([r,e])=>[r.slice(1),e]},{name:"numRange",rule:/^]/,format:([r,e])=>[r.slice(1),e.join("|")]},{name:"timeRange",rule:/^#/,format:([r,e])=>[r.slice(1),e.join("|")]},{name:"sort",rule:/^sort$/,format:([r,e])=>Array.from(Object.entries(e))[0]},{name:"includes",rule:/^%/,format:([r,e])=>[r.slice(1),e.join("|")]},{name:"equal",rule:/./,format:([r,e])=>[r,Array.isArray(e)?e[0]:e]}],Qr=function(r,e){let t=[],n=[];return r.forEach(a=>{(e.test(a[0])?t:n).push(a)}),[t,n]},Yr=function(r,e){let t=[];return e.reduce((n,a)=>{if(!n.some(u=>a.rule.test(u[0])))return n;let[i,o]=Qr(n,a.rule);return i.length&&t.push([a.name,i.map(a.format)]),o},r),t},Zr=n=>{var a=n,{page:r,limit:e}=a,t=V(a,["page","limit"]);let o=Array.from(Object.entries(t)).filter(([f,l])=>l!=null),s=Yr(o,Gr).reduce((f,[l,b])=>`${f}${l}=${b.map(y=>y.join(":")).join(",")}&`,"").slice(0,-1),m=r?`&page=${r}`:"",g=e?`&limit=${e}`:"",c=s+m+g;return c=c[0]==="&"?c.slice(1):c,c},be=Xr.create({baseURL:`${xe.ApiDomain}`,paramsSerializer:Zr});be.interceptors.request.use(r=>{let e=K.get();return e&&(r.headers.token=e),r},ge);be.interceptors.response.use(r=>Promise.resolve(r.data),ge);function ge(r){let{message:e,response:t}=r,n=-1;if(t){let{status:a,data:i}=t;if(n=a,n===401)return Se.error(i,()=>{K.remove(),window.location.replace("/")}),Promise.reject(r)}return Promise.resolve({code:n,msg:e})}export{Xr as a,be as r};
//# sourceMappingURL=request.afec6a83.js.map
