import req from "../../util/request"

export default {
  options: () => req.get(`vehicle/options`),
  get: (id) => req.get(`vehicle/${id}`),
  getList: (params, cancelToken) => req.get('vehicle/list', { params, cancelToken }),
  edit: (id, data) => req.put(`vehicle/${id}`, data),
  dele: (id) => req.delete(`vehicle/${id}`),
  add: (data) => req.post('vehicle', data),
};
