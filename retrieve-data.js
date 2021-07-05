const _setretrieveStr = Symbol('_setretrieveStr')
const _replaceRieveStr = Symbol('_replaceRieveStr')
const _reductionValue = Symbol('_reductionValue')
const _isBooleanData = Symbol('_isBooleanData')
const _retrieveData = Symbol('_retrieveData')

// 返回数据类型
export let dataType = function (data) {
  let s = Object.prototype.toString.call(data);
  let type = s.match(/\[object (.*?)\]/)[1].toLowerCase(data);
  return type
}

/**
 * 根据传入的脚本字符串程序会自动检查传入的数据，每一层逐个校验，全部校验通过返回传入的数据，若某一项数据不存在则返回false；
 * retrieveStr (string) 必传参数 第一个参数,获取数据的脚本字符串；
 * data 任意类型 必传参数，第二个参数 传入的数据；
 * matchObj (Object) 可选参数 形如循环体中obj[m][n]这样的获取方式 可以传入第三参数 matchObj => {m: '数字'，n: '数字'}，
 * 程序会自动将obj[m][n] 中的变量吗，n 替换为 传入的matchObj 中对应的值；
 */
export default class RetrieveData {
  constructor(props) { 
  }

  // 替换变量
  [_setretrieveStr](retrieveStr, matchObj) {
    let updateret_retrieveStr = retrieveStr
    let reduce_reg = /(?<=\[).*?(?=\])/g
    let type_matchObj = dataType(matchObj)
    if (type_matchObj === 'object') {
      updateret_retrieveStr = retrieveStr.replace(reduce_reg, (matchValue, matchIndex, value) => {
        let keys = Object.keys(matchObj)
        let curry_key = keys.filter(function (curryKey) {
          return matchValue === curryKey
        })
        return curry_key.length > 0 ? this[_replaceRieveStr](matchObj, curry_key) : matchValue
      })
    }
    return updateret_retrieveStr
  }

  // 替换规则，若replaceValue类型是数字说明是取的是数组的值，直接替换，若replaceValue类型是字符串则说明是要取对象的属性值，则加上双引号
  [_replaceRieveStr](matchObj, curryKey) {
    let type = dataType(matchObj[curryKey])
    let replaceValue = matchObj[curryKey];
    if (type === 'string') {
      replaceValue = `"${replaceValue}"`
    }
    return replaceValue
  }

  // 校验数据过程
  retrieve(retrieveStr, data, index) {
    let updateret_retrieveStr = this[_setretrieveStr](retrieveStr, index)
    let reduction_value = this[_reductionValue](updateret_retrieveStr)
    let check_esult = this[_retrieveData](reduction_value, data)
    return this[_isBooleanData](check_esult)
  }

  // 还原取值的字符串脚本
  [_reductionValue](updateret_retrieveStr) {
    let reg = /((\[).*?(\]))|(\.)/g
    let reduction_value = updateret_retrieveStr.replace(reg, "?$&").split("?")
    reduction_value[0] = 'dataObj'
    return reduction_value
  }

  // 校验结果
  [_isBooleanData](checkResult) {
    let check_esult = true;
    check_esult = checkResult.errror_count > 0 ? false : checkResult.data
    return check_esult
  }

  // 从左到右依次检查每一个数据是否合法
  [_retrieveData](reduction_value, data) {
    let dataObj = data
    let reaultData = '';
    let errror_count = 0;
    let reault = reduction_value.reduce(function (t, next) {
      let curry_data = ''
      try {
        curry_data = eval(t || '');
      } catch (error) {
        console.warn('错误信息:', error)
      }
      if (curry_data !== 0 && !curry_data) {
        errror_count++
        return false
      }
      return t + next
    })
    try {
      reaultData = eval(reault)
    } catch (error) {
      console.warn('错误信息:', error)
    }
    if (reaultData !== 0 && !reaultData) {
      errror_count++
    }
    return { errror_count: errror_count, data: reaultData }
  }
}

