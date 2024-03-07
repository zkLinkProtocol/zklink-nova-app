import axios from "axios";
// import _ from 'lodash';
// import qs from 'qs';
// import toast from "react-hot-toast";

const http = axios.create({
    baseURL: ''
});
http.defaults.transformRequest = data => {
    // if (_.isPlainObject(data)) data = qs.stringify(data);
    return data;
};
http.interceptors.response.use(response => {
    return response.data;
}, reason => {
    // toast.error(reason.message);
    return Promise.reject(reason);
});
export default http;