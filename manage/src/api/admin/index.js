import req from "../../util/request"

export default {
  getList: (params, cancelToken) => req.get('admin/list', { params, cancelToken }),
  getOptions: params => req.get('admin/options', { params }),
  getDriverOptions: adminId => req.get(`admin/driverOptions/${adminId}`),
  add: data => req.post('admin', data),
  edit: (id, data) => req.put(`admin/${id}`, data),
  editPassword: (id, data) => req.put(`admin/${id}/password`, data),
  dele: id => req.delete(`admin/${id}`),
};
