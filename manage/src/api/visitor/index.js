import req from "../../util/request"

export default {
  get: (id) => req.get(`visitor/${id}`),
  getList: (params, cancelToken) => req.get('visitor/list', { params, cancelToken }),
  edit: (id, data) => req.put(`visitor/${id}`, data),
  dele: (id) => req.delete(`visitor/${id}`),
  add: (data) => req.post('visitor', data),
};
