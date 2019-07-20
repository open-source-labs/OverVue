// import something here
import axios from 'axios'

// "async" is optional
export default ({ Vue }) => {
  Vue.prototype.$axios = axios
}
