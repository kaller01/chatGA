import axios from 'axios'


export default () => {
  return axios.create({
    baseURL: 'http://192.168.250.60:3300/'
  })
}
