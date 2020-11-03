// @ts-nocheck
import axios from 'axios'
import vue from '../main.js'
let serverUrl = '/api/' //本地调试时
//let sap_client = '222' //本地调试时
let sap_client = '800' //本地调试时
// axios.head('Accept','application/json, text/plain, */*')
// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    switch (error.response.status) {
      case 400:
        // vue.$notify.error({
        //   title: error.response.data.errorCode,
        //   message: error.response.data.errorMessage
        // })
        return Promise.reject(error)
      // break
      case 401:
        vue.$notify.error({
          title: '错误',
          message: '登录信息未认证',
        })
        break
      case 403:
        vue.$notify.error({
          title: '错误',
          message: '您没有权限进行此操作',
        })
        break
      case 404:
        vue.$notify.error({
          title: '错误',
          message: '未找到接口数据',
        })
        // store.state.pageLoading = false;
        break
      case 302:
        // window.location = '/'
        break
      case 500:
        // vue.$notify.error({
        //   title: '错误',
        //   message: '服务器错误'
        // })
        localStorage.removeItem('token')
        // window.location = '/'
        break
      default:
        vue.$notify.error({
          title: '错误',
          message: `未知错误 ${error.response.status}`,
        })
        return Promise.reject(error)
    }
  }
)
const service = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    Authorization: 'Basic emhhbmd5b25nOjM0NTY3ODkw',
    Accept: 'application/json, text/plain, */*',
    Cookie: 'sap-usercontext=sap-client=222',
  },
  auth: userInfo,
})
const api = {
  companyListing: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client + '&query=bukrs',
  factoryListing: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client + '&query=werks&bukrs=9200',
  materuakRequisition: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client,
  submit: serverUrl + 'sap/bc/zh/eam/spapplypost?sap-client=' + sap_client,
  costCenter: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client + '&query=kostl&bukrs=',
  theInventoryLocation: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client + '&query=lgort&werks=',
  //9200
  receivingPaty: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=' + sap_client + '&query=holder&bukrs=',
}
/* const userInfo = {
  username: 'zhangyong',
  password: '34567890',
} */
//正式
const userInfo = {
  username: 'RFC_EAM',
  password: 'RFC_EAM',
}
//公司清单
const getCompany = (params, data) => {
  return axios({
    method: 'GET',
    url: api.companyListing,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}

//工厂清单
const getfactory = (params, data) => {
  return axios({
    method: 'GET',
    url: api.factoryListing,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
//收货方
const receivingPaty = (bukrs) => {
  return axios({
    method: 'GET',
    url: api.receivingPaty + bukrs,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
//库存地点
const theInventoryLocation = (werks) => {
  return axios({
    method: 'GET',
    url: api.theInventoryLocation + werks,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
//成本中心
const costCenter = (bukrs) => {
  return axios({
    method: 'GET',
    url: api.costCenter + bukrs,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
//领料单
const getMateruakRequisition = (params, data) => {
  return axios({
    method: 'POST',
    url: api.materuakRequisition,
    data: params,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
//提交
const submit = (params, data) => {
  return axios({
    method: 'POST',
    url: api.submit,
    data: params,
    // withCredentials: true, // 默认的
    auth: userInfo,
  })
    .then((res) => res.data)
    .catch((err) => err)
}
export default {
  axios,
  getCompany,
  getfactory,
  getMateruakRequisition,
  submit,
  costCenter,
  theInventoryLocation,
  receivingPaty,
}
