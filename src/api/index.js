// @ts-nocheck
import axios from 'axios'
import vue from '../main.js'
let serverUrl = '/api/' //本地调试时
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
          message: '登录信息未认证'
        })
        break
      case 403:
        vue.$notify.error({
          title: '错误',
          message: '您没有权限进行此操作'
        })
        break
      case 404:
        vue.$notify.error({
          title: '错误',
          message: '未找到接口数据'
        })
        // store.state.pageLoading = false;
        break
      case 302:
        window.location = '/'
        break
      case 500:
        // vue.$notify.error({
        //   title: '错误',
        //   message: '服务器错误'
        // })
        localStorage.removeItem('token')
        window.location = '/'
        break
      default:
        vue.$notify.error({
          title: '错误',
          message: `未知错误 ${error.response.status}`
        })
        return Promise.reject(error)
    }
  }
)
const service = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    Authorization: 'Basic emhhbmd5b25nOjM0NTY3ODkw',
    Accept: 'application/json, text/plain, */*',
    Cookie: 'sap-usercontext=sap-client=222'
  },
  auth: userInfo
})
const api = {
  companyListing: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=222&query=bukrs',
  factoryListing: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=222&query=werks&bukrs=9200',
  materuakRequisition: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=222',
  submit: serverUrl + 'sap/bc/zh/eam/spapplypost?sap-client=222'
}
const userInfo = {
  username: 'zhangyong',
  password: '34567890'
}
//公司清单
const getCompany = (params, data) => {
  return axios({
    method: 'GET',
    url: api.companyListing,
    // withCredentials: true, // 默认的
    auth: userInfo
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
    auth: userInfo
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
    auth: userInfo
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
    auth: userInfo
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
  dataUrl: serverUrl + 'sap/bc/zh/eam/spapplylist?sap-client=222',

  // 获取所有等级
  getGrades() {
    return axios.get(this.dataUrl + '/api/grade/all')
  },
  AddGrades(data) {
    return axios.post(baseUrl + '/api/grade/add', data)
  },
  SaveGrades(data) {
    return axios.post(baseUrl + '/api/grade/edit', data)
  },
  // 获取在机生产计划
  getLinePlans(data) {
    return axios.post(baseUrl + '/api/productPlan/getInProductPlans', data)
  },
  // 丝车: 获取丝车详情
  getSilkss(code) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/get/' + code)
  },
  // 丝车: 解绑
  silkUnbind(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/separate', data)
  },
  // 丝车: 定等
  dingDeng(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/graded', data)
  },
  // 丝车: 拼车
  poolSilkCar(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/carPool/silkCarPooling', data)
  },
  // 落筒: 自动线人工落筒 扫机台
  getSilkCarDoff(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/getSilkCarDoffSpec', data)
  },
  // 落筒: 扫完机台获取位数
  getMqDoffMessage(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/getMqDoffMessage', data)
  },
  // 落筒确定
  manualDoff(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/doff/manualDoff', data)
  },
  // 丝车: 人工打包
  handPack(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/handPack', data)
  },
  // 丝车: 暂存箱打包
  temporaryPack(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/temporaryPack', data)
  },
  // 入暂存箱
  packInTemBox(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/pack/inTemporaryBox', data)
  },

  // 获取所有异常
  getAllExceptions() {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/silkException/findAll')
  },
  // 获取所有备注
  getAllSilkNote() {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '/api/silkNote/findAll')
  },
  // 解绑撤销
  silkSeparateRecover(data) {
    // console.log("data" +  data.toString())
    return axios.post(baseUrl + '/api/silkCarOnline/silkSeparateRecover', data)
  },
  // 获取所有备注
  getCompanyHengyi() {
    // console.log("data" +  data.toString())
    return axios.get(baseUrl + '&query=bukrs')
  }
}
