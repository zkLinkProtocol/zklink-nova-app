import axios from "axios";
// import _ from 'lodash';
// import qs from 'qs';
// import toast from "react-hot-toast";

const http = axios.create({
  baseURL: "",
});
// http.defaults.transformRequest = data => {
//     // if (_.isPlainObject(data)) data = qs.stringify(data);
//     return data;
// };

http.interceptors.request.use(
  (config) => {
    // console.log("config", config, config.url?.includes("/lrt-points"));
    const apiToken = localStorage.getItem("API_TOKEN");
    if (!!apiToken && !config.url?.includes("/lrt-points")) {
      config.headers["Authorization"] = `Bearer ${apiToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (reason) => {
    // toast.error(reason.message);
    if (reason.response && reason.response.data) {
      return Promise.reject(reason.response.data);
    }
    return Promise.reject(reason);
  }
);
export default http;
