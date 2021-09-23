// 封装axios

// 引入axios
import axios from 'axios'

// 判断当前环境确定所使用的基地址
let host = '';
if (process.env.NODE_ENV == "development") {
  // 开发环境所用的基地址
  host = 'http://127.0.0.1:8888/api/private/v1/';
} else {
  // 生产环境所使用的基地址
  host = 'http://127.0.0.1:8888/api/private/v1/';
}

// 创建axios, 并设置默认基地址或其他默认项.
const instance = axios.create({
  baseURL: host,
  timeout: 4000
})

// 设置请求拦截器
instance.interceptors.request.use(config => {
  // 拦截请求, 格式化参数
  // 添加token请求头
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

// 设置返回拦截器
instance.interceptors.response.use(res => {
  return res
})

// 将设置好的axios导出
export default instance