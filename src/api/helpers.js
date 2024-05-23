import axios from 'ts-axios-new'
const urlMap = {
  development: 'http://127.0.0.1:8082/api/',
  production: 'http://ustbhuangyi.com/sell/'
}
const baseUrl = urlMap[process.env.NODE_ENV]
const ERR_OK = 200

export function get(url) {
  return function(params = {}) {
    return axios.get(baseUrl + url, {
      params
    }).then((res) => {
      const {code, data, msg} = res.data
      if (code === ERR_OK) {
        return data
      }
      throw msg
    })
  }
}

export function post(url) {
  return function(params = {}) {
    return axios.post(baseUrl + url,
      params
    ).then((res) => {
      const {code, data} = res.data
      if (code === ERR_OK) {
        return data
      }
    }).catch((e) => {
      console.log(e)
    })
  }
}
