import axios from 'axios'

let fetcher = axios.create({
  method: 'post',
  baseURL: 'http://127.0.0.1:3000',
  // transformRequest: [function (data) {
  //   const userInfo = {
  //     userid: localStorage.getItem('userid'),
  //     usertoken: localStorage.getItem('usertoken')
  //   }
  //   if (userInfo && data && !data.NOUSERINFO) {
  //     data.userid = userInfo.userid
  //     data.usertoken = userInfo.usertoken
  //   }
  //   return JSON.stringify(data)
  // }],
  
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
fetcher.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
// 添加响应拦截器
fetcher.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default fetcher.post
