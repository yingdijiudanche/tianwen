import req from "../../util/request"

export default {
  get: (id) => req.get(`driver/${id}`),
  getList: (params, cancelToken) => req.get('driver/list', { params, cancelToken }),
  edit: (id, data) => req.put(`driver/${id}`, data),
  dele: (id) => req.delete(`driver/${id}`),
  add: (data) => req.post('driver', data),
};
