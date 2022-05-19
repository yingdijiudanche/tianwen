import req from "../../util/request";

export default {
  getAll: () => req.get(`spare/all`),
  add: (data) => req.post("spare", data),
};
