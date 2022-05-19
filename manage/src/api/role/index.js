import req from "../../util/request"

export default {
  getAll: params => req.get('role/all', { params }),
  getOptions: () => req.get('role/options'),
  edit: (id, data) => req.put(`role/${id}`, data),
  dele: id => req.delete(`role/${id}`),
  add: data => req.post('role', data),
};
