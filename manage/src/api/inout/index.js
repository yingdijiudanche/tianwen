import req from "../../util/request"

export default {
  getList: (params, cancelToken) => req.get('inout/list', { params, cancelToken }),
};
