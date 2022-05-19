import req from "../../util/request"

export default {
  getOptions: () => req.get(`vehicleType/options`),
  getList: (params, cancelToken) => req.get('vehicleType/list', { params, cancelToken }),
  edit: (id, data) => req.put(`vehicleType/${id}`, data),
  dele: (id) => req.delete(`vehicleType/${id}`),
  add: (data) => req.post('vehicleType', data),
};
