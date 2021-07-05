
import RetrieveData from './retrieve-data'

export default function $r(retrieveStr, data, matchObj) {
  if (arguments.length < 2) {
    console.warn('======缺少必传参数======')
    return false
  }
  if (!arguments[0] || typeof arguments[0] !== 'string') {
    console.warn('======参数retrieveStr不能为空且类型必须为字符串 ======')
    return false
  }
  return initRetrieveData(retrieveStr, data, matchObj)
}

// 调用RetrieveData类
initRetrieveData.retrieveData = null
function initRetrieveData(retrieveStr, data, matchObj) {
  if (!initRetrieveData.retrieveData) {
    initRetrieveData.retrieveData = new RetrieveData()
  }
  return initRetrieveData.retrieveData.retrieve(retrieveStr, data, matchObj)
}