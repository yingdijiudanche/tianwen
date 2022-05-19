import req from "../../util/request"

export default {
  getAll: () => req.get(`menu/all`),
  options: () => req.get(`menu/options`),
  getAllByRoleId: roleId => req.get(`menu/${roleId}/all`),
  getList: (params, cancelToken) => req.get('menu/list', { params, cancelToken }),
  edit: (id, data, pid) => req.put(`menu/${id}${pid ? `/${pid}` : ''}`, data),
  dele: (id, pid) => req.delete(`menu/${id}${pid ? `/${pid}` : ''}`),
  add: (data, pid) => req.post(`menu${pid ? `/${pid}` : ''}`, data),
};
