import req from "../../util/request";

export default {
  getList: (params, cancelToken) =>
    req.get("contractingBusinessDept/list", { params, cancelToken }),
  getOptions: (params) =>
    req.get("contractingBusinessDept/options", { params }),
};
