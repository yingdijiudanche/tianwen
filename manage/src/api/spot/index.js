import req from "../../util/request";

export default {
  getAll: () => req.get(`spot/all`),
};
