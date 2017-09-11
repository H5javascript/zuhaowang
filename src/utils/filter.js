import Timeago from 'timeago.js'
import dateFormat from 'dateformat'
const timeago = new Timeago()

export default {
  formateTime (time) {
    return timeago.format(time, 'zh_CN')
  },
  sliceStr (str) {
    return str.length > 40 ? `${str.slice(0, 40)}...` : str
  },
  formatDate (time) {
    let timeSecond = parseInt(time)
    return dateFormat(timeSecond, 'isoDate')
  }
}
