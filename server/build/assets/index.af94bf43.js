import{r as a}from"./request.6e8ef974.js";var i={getList:(t,d)=>a.get("admin/list",{params:t,cancelToken:d}),getOptions:t=>a.get("admin/options",{params:t}),add:t=>a.post("admin",t),edit:(t,d)=>a.put(`admin/${t}`,d),editPassword:(t,d)=>a.put(`admin/${t}/password`,d),dele:t=>a.delete(`admin/${t}`)};export{i as a};
//# sourceMappingURL=index.af94bf43.js.map
