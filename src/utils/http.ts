import axios from "axios";
import qs from 'qs';
import _ from 'lodash';
import toast from "react-hot-toast";

const http = axios.create({
    baseURL: '/api'
});
http.defaults.transformRequest = data => {
    if (_.isPlainObject(data)) data = qs.stringify(data);
    return data;
};
http.interceptors.response.use(response => {
    return response.data;
}, reason => {
    toast.error('Request Failed');
    return Promise.reject(reason);
});
export default http;