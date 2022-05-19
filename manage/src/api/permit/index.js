import req from "../../util/request"

export default {
  get: (id) => req.get(`permit/${id}`),
  getList: (params, cancelToken) => req.get('permit/list', { params, cancelToken }),
};
