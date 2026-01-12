/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
import i18n from '@/locale'
export function resetPage(page) {
  return [10, 20, 50, 100, 200, 500, 1000]
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 将时间戳转成年月日时分秒
export function resetTime(date, type) {
  var myDate = date ? new Date(type == 4 ? date * 1000 : date) : new Date();
  var Year = myDate.getFullYear(); // 获取年
  var Month = myDate.getMonth() + 1; // 获取月，默认从0开始，所以要加一
  var Dates = myDate.getDate(); // 获取日
  var Hour = myDate.getHours(); // 获取小时
  var Minute = myDate.getMinutes(); // 获取分
  var Seconds = myDate.getSeconds(); // 获取秒
  // 当数值为个数时，在前面加0
  if (Month < 10) {
    Month = '0' + Month
  }
  if (Dates < 10) {
    Dates = '0' + Dates
  }
  if (Hour < 10) {
    Hour = '0' + Hour
  }
  if (Minute < 10) {
    Minute = '0' + Minute
  }
  if (Seconds < 10) {
    Seconds = '0' + Seconds
  }
  if (type == 1) {
    return Date.parse(Year + '-' + Month + '-' + Dates + ' ' + '00:00:00') / 1000;
  } else if (type == 2) {
    return Date.parse(Year + '-' + Month + '-' + Dates + ' ' + '23:59:59') / 1000;
  } else if (type == 3) {
    return Date.parse(Year + '-' + Month + '-' + Dates + ' ' + Hour + ':' + Minute + ':' + Seconds) / 1000;
  } else if (type == 4) {
    return Year + '/' + Month + '/' + Dates + ' ' + Hour + ':' + Minute + ':' + Seconds;
  } else if (type == 5) {
    return Month + '-' + Dates;
  } else if (type == 6) {
    return Hour + ':' + Minute;
  } else if (type == 7) {
    return Year + ',' + Month + ',' + Dates;
  } else if (type == 8) {
    return new Date(Year + ',' + Month + ',' + Dates + ',10:30');
  } else {
    return Year + '-' + Month + '-' + Dates + ' ' + Hour + ':' + Minute + ':' + Seconds;
  }
}

export function newsTime(time) {
  var myDate = time ? new Date(time) : new Date();
  var Year = myDate.getFullYear(); // 获取年
  var Month = myDate.getMonth() + 1; // 获取月，默认从0开始，所以要加一
  var Dates = myDate.getDate(); // 获取日
  var Hour = myDate.getHours(); // 获取小时
  var Minute = myDate.getMinutes(); // 获取分
  var Seconds = myDate.getSeconds(); // 获取秒
  if (Month < 10) {
    Month = '0' + Month
  }
  if (Dates < 10) {
    Dates = '0' + Dates
  }
  if (Hour < 10) {
    Hour = '0' + Hour
  }
  if (Minute < 10) {
    Minute = '0' + Minute
  }
  if (Seconds < 10) {
    Seconds = '0' + Seconds
  }
  var currentStamp = new Date().setHours(0, 0, 0, 0);
  var paramStamp = new Date(time).setHours(0, 0, 0, 0);
  if (currentStamp == paramStamp) {
    return Hour + ':' + Minute
  } else {
    return Month + '-' + Dates
  }
}
export function syncReadFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (res) => {
      resolve(res.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
export function cutParam(url) {
  const obj = {}
  const str = url.split('?')[1].split('&');
  for (var i = 0; i < str.length; i++) {
    const a = str[i].split('=')
    obj[a[0]] = a[1]
  }
  return obj
}

export function emoji_icon() {
  return [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🤧',
    '😵',
    '🤯',
    '🤠',
    '😎',
    '🤓',
    '🧐',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '😤',
    '😡',
    '😠',
    '🤬',
    '😈',
    '👿',
    '💀',
    '💩',
    '🤡',
    '👹',
    '👺',
    '👻',
    '👽',
    '👾',
    '🤖',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
    '💋',
    '👋',
    '🤚',
    '🖐',
    '✋',
    '🖖',
    '👌',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '💅',
    '🤳',
    '💪',
    '👂',
    '👃',
    '🧠',
    '👀',
    '👁',
    '👅',
    '👄',
    '👶',
    '🧒',
    '👦',
    '👧',
    '🧑',
    '👱',
    '👨',
    '🧔',
    '👱‍',
    '👨‍',
    '👨‍',
    '👨‍',
    '👨‍',
    '👩',
    '👱‍',
    '👩‍',
    '👩‍',
    '👩‍',
    '👩‍',
    '🧓',
    '👴',
    '👵',
    '🙍',
    '🙍‍',
    '🙍‍',
    '🙎',
    '🙎‍',
    '🙎‍',
    '🙅',
    '🙅‍',
    '🙅‍',
    '🙆',
    '🙆‍',
    '🙆‍',
    '💁',
    '💁‍',
    '💁‍',
    '🙋',
    '🙋‍',
    '🙋‍',
    '🙇',
    '🙇‍',
    '🙇‍',
    '🤦',
    '🤦‍',
    '🤦‍',
    '🤷',
    '🤷‍',
    '🤷‍',
    '👨‍⚕️',
    '👩‍⚕️',
    '👨‍🎓',
    '👩‍🎓',
    '👨‍🏫',
    '👩‍🏫',
    '👨‍⚖️',
    '👩‍⚖️',
    '👨‍🌾',
    '👩‍🌾',
    '👨‍🍳',
    '👩‍🍳',
    '👨‍🔧',
    '👩‍🔧',
    '👨‍🏭',
    '👩‍🏭',
    '👨‍💼',
    '👩‍💼',
    '👨‍🔬',
    '👩‍🔬',
    '👨‍💻',
    '👩‍💻',
    '👨‍🎤',
    '👩‍🎤',
    '👨‍🎨',
    '👩‍🎨',
    '👨‍✈️',
    '👩‍✈️',
    '👨‍🚀',
    '👩‍🚀',
    '👨‍🚒',
    '👩‍🚒',
    '👮',
    '👮‍♂️',
    '👮‍♀️',
    '🕵',
    '🕵️‍♂️',
    '🕵️‍♀️',
    '💂',
    '💂‍',
    '💂‍',
    '👷',
    '👷‍',
    '👷‍',
    '🤴',
    '👸',
    '👳',
    '👳‍',
    '👳‍',
    '👲',
    '🧕',
    '🤵',
    '👰',
    '🤰',
    '🤱',
    '👼',
    '🎅',
    '🤶',
    '🧙',
    '🧙‍',
    '🧙‍',
    '🧚',
    '🧚‍',
    '🧚‍',
    '🧛',
    '🧛‍',
    '🧛‍',
    '🧜',
    '🧜‍',
    '🧜‍',
    '🧝',
    '🧝‍',
    '🧝‍',
    '🧞',
    '🧞‍',
    '🧞‍',
    '🧟',
    '🧟‍',
    '🧟‍',
    '💆',
    '💆‍',
    '💆‍',
    '💇',
    '💇‍',
    '💇‍',
    '🚶',
    '🚶‍',
    '🚶‍',
    '🏃',
    '🏃‍',
    '🏃‍',
    '💃',
    '🕺',
    '🕴',
    '👯',
    '👯‍',
    '👯‍',
    '🧖',
    '🧖‍',
    '🧖‍',
    '🧘',
    '👭',
    '👫',
    '👬',
    '💏',
    '👨‍',
    '👩‍',
    '💑',
    '👨‍',
    '👩‍',
    '👪',
    '👨‍👩‍👦',
    '👨‍👩‍👧',
    '👨‍👩‍👧‍👦',
    '👨‍👩‍👦‍👦',
    '👨‍👩‍👧‍👧',
    '👨‍👨‍👦',
    '👨‍👨‍👧',
    '👨‍👨‍👧‍👦',
    '👨‍👨‍👦‍👦',
    '👨‍👨‍👧‍👧',
    '👩‍👩‍👦',
    '👩‍👩‍👧',
    '👩‍👩‍👧‍👦',
    '👩‍👩‍👦‍👦',
    '👩‍👩‍👧‍👧',
    '👨‍👦',
    '👨‍👦‍👦',
    '👨‍👧',
    '👨‍👧‍👦',
    '👨‍👧‍👧',
    '👩‍👦',
    '👩‍👦‍👦',
    '👩‍👧',
    '👩‍👧‍👦',
    '👩‍👧‍👧',
    '🗣',
    '👤',
    '👥',
    '👣',
    '🌂',
    '☂',
    '👓',
    '🕶',
    '👔',
    '👕',
    '👖',
    '🧣',
    '🧤',
    '🧥',
    '🧦',
    '👗',
    '👘',
    '👙',
    '👚',
    '👛',
    '👜',
    '👝',
    '🎒',
    '👞',
    '👟',
    '👠',
    '👡',
    '👢',
    '👑',
    '👒',
    '🎩',
    '🎓',
    '🧢',
    '⛑',
    '💄',
    '💍',
    '💼'
  ]
}

export function successTips(_this, type, msg) {
  return _this.$message({ showClose: false, message: msg || '操作完成！', type: type || 'success' });
}
export function autoOptions() {
  return [
    {
      value: 'zh',
      label: '中文（简体）'
    },
    {
      value: 'en',
      label: '英语'
    },
    {
      value: 'ie',
      label: '爱尔兰'
    },
    {
      value: 'ja',
      label: '日语'
    },
    {
      value: 'ko',
      label: '韩语'
    },
    {
      value: 'th',
      label: '泰语'
    },
    {
      value: 'vi',
      label: '越南语'
    },
    {
      value: 'pt_pt',
      label: '葡萄牙语'
    },
    {
      value: 'km',
      label: '高棉语'
    },
    {
      value: 'es',
      label: '西班牙语'
    },
    {
      value: 'ms',
      label: '马来语'
    },
    {
      value: 'id',
      label: '印度尼西亚语'
    }
  ]
}

export function langOptions() {
  return [{
    label: 'A',
    options: [
      {
        value: 'sq',
        label: '阿尔巴尼亚语'
      }, {
        value: 'am',
        label: '阿姆哈拉语'
      }, {
        value: 'ar',
        label: '阿拉伯语'
      }, {
        value: 'az',
        label: '阿塞拜疆语'
      }, {
        value: 'et',
        label: '爱沙尼亚语'
      }, {
        value: 'ga',
        label: '爱尔兰语'
      }
    ]
  },
  {
    label: 'B',
    options: [{
      value: 'eu',
      label: '巴斯克语'
    }, {
      value: 'be',
      label: '白俄罗斯语'
    }, {
      value: 'bs',
      label: '波斯尼亚语'
    }, {
      value: 'bg',
      label: '保加利亚语'
    },
    {
      value: 'is',
      label: '冰岛语'
    }, {
      value: 'fa',
      label: '波斯语'
    }, {
      value: 'pl',
      label: '波兰语'
    }, {
      value: 'xh',
      label: '班图语'
    }
    ]
  },
  {
    label: 'D',
    options: [
      {
        value: 'da',
        label: '丹麦语'
      }, {
        value: 'de',
        label: '德语'
      }
    ]
  },
  {
    label: 'E',
    options: [
      {
        value: 'ru',
        label: '俄语'
      }
    ]
  },
  {
    label: 'F',
    options: [
      {
        value: 'fi',
        label: '芬兰语'
      }, {
        value: 'fr',
        label: '法语'
      }, {
        value: 'fy',
        label: '弗里斯兰语'
      }
    ]
  },
  {
    label: 'G',
    options: [
      {
        value: 'ka',
        label: '格鲁吉亚语'
      }, {
        value: 'gu',
        label: '古吉拉特语'
      }, {
        value: 'km',
        label: '高棉语'
      }
    ]
  },
  {
    label: 'H',
    options: [
      {
        value: 'nl',
        label: '荷兰语'
      }, {
        value: 'ht',
        label: '海地克里奥尔语'
      }, {
        value: 'ha',
        label: '豪萨语'
      }, {
        value: 'kk',
        label: '哈萨克语'
      }, {
        value: 'ko',
        label: '韩语'
      }
    ]
  },
  {
    label: 'I',
    options: [
      {
        value: 'ie',
        label: '爱尔兰'
      }
    ]
  },
  {
    label: 'J',
    options: [
      {
        value: 'ca',
        label: '加泰罗尼亚语'
      }, {
        value: 'cs',
        label: '捷克语'
      }, {
        value: 'gl',
        label: '加利西亚语'
      }, {
        value: 'ky',
        label: '吉尔吉斯语'
      }
    ]
  },
  {
    label: 'K',
    options: [
      {
        value: 'co',
        label: '科西嘉语'
      }, {
        value: 'hr',
        label: '克罗地亚语'
      }, {
        value: 'kn',
        label: '卡纳达语'
      }, {
        value: 'ku',
        label: '库尔德语'
      }
    ]
  },
  {
    label: 'L',
    options: [
      {
        value: 'lo',
        label: '老挝语'
      }, {
        value: 'la',
        label: '拉丁文'
      }, {
        value: 'lv',
        label: '拉脱维亚语'
      }, {
        value: 'lt',
        label: '立陶宛语'
      }, {
        value: 'lb',
        label: '卢森堡语'
      }, {
        value: 'ro',
        label: '罗马尼亚语'
      }
    ]
  },
  {
    label: 'M',
    options: [
      {
        value: 'bn',
        label: '孟加拉语'
      }, {
        value: 'hmn',
        label: '苗语'
      }, {
        value: 'mk',
        label: '马其顿语'
      }, {
        value: 'ms',
        label: '马来语'
      }, {
        value: 'ml',
        label: '马拉雅拉姆文'
      }, {
        value: 'mt',
        label: '马耳他语'
      }, {
        value: 'mi',
        label: '毛利语'
      }, {
        value: 'mr',
        label: '马拉地语'
      }, {
        value: 'mn',
        label: '蒙古文'
      }, {
        value: 'my',
        label: '缅甸语'
      }
    ]
  },
  {
    label: 'N',
    options: [
      {
        value: 'af',
        label: '南非荷兰语'
      }, {
        value: 'ne',
        label: '尼泊尔语'
      }, {
        value: 'no',
        label: '挪威语'
      }, {
        value: 'ny',
        label: '尼杨扎语（齐切瓦语）'
      }
    ]
  },
  {
    label: 'P',
    options: [
      {
        value: 'ps',
        label: '普什图语'
      }, {
        value: 'pt',
        label: '葡萄牙语（葡萄牙、巴西）'
      }, {
        value: 'pa',
        label: '旁遮普语'
      }
    ]
  },
  {
    label: 'R',
    options: [
      {
        value: 'ja',
        label: '日语'
      }, {
        value: 'sv',
        label: '瑞典语'
      }
    ]
  },
  {
    label: 'S',
    options: [
      {
        value: 'ceb',
        label: '宿务语'
      }, {
        value: 'eo',
        label: '世界语'
      },
      {
        value: 'sm',
        label: '萨摩亚语'
      }, {
        value: 'gd',
        label: '苏格兰盖尔语'
      },
      {
        value: 'sr',
        label: '塞尔维亚语'
      }, {
        value: 'st',
        label: '塞索托语'
      },
      {
        value: 'si',
        label: '僧伽罗语'
      }, {
        value: 'sk',
        label: '斯洛伐克语'
      }, {
        value: 'sl',
        label: '斯洛文尼亚语'
      }, {
        value: 'so',
        label: '索马里语'
      }, {
        value: 'sw',
        label: '斯瓦希里语'
      }
    ]
  },
  {
    label: 'T',
    options: [
      {
        value: 'tl',
        label: '塔加路语（菲律宾语）'
      }, {
        value: 'tg',
        label: '塔吉克语'
      }, {
        value: 'ta',
        label: '泰米尔语'
      }, {
        value: 'te',
        label: '泰卢固语'
      }, {
        value: 'th',
        label: '泰文'
      }, {
        value: 'tr',
        label: '土耳其语'
      }
    ]
  },
  {
    label: 'W',
    options: [
      {
        value: 'uk',
        label: '乌克兰语'
      }, {
        value: 'ur',
        label: '乌尔都语'
      }, {
        value: 'uz',
        label: '乌兹别克语'
      }, {
        value: 'cy',
        label: '威尔士语'
      }
    ]
  },
  {
    label: 'X',
    options: [
      {
        value: 'el',
        label: '希腊语'
      }, {
        value: 'haw',
        label: '夏威夷语'
      }, {
        value: 'hu',
        label: '匈牙利语'
      }, {
        value: 'sn',
        label: '修纳语'
      }, {
        value: 'sd',
        label: '信德语'
      }, {
        value: 'es',
        label: '西班牙语'
      }, {
        value: 'su',
        label: '巽他语'
      }
    ]
  },
  {
    label: 'Y',
    options: [
      {
        value: 'hy',
        label: '亚美尼亚语'
      }, {
        value: 'en',
        label: '英语'
      }, {
        value: 'hi',
        label: '印地语'
      }, {
        value: 'ig',
        label: '伊博语'
      }, {
        value: 'id',
        label: '印度尼西亚语'
      }, {
        value: 'it',
        label: '意大利语'
      }, {
        value: 'vi',
        label: '越南语'
      }, {
        value: 'yi',
        label: '意第绪语'
      }, {
        value: 'yo',
        label: '约鲁巴语'
      }
    ]
  },
  {
    label: 'Z',
    options: [
      {
        value: 'jv',
        label: '爪哇语'
      }, {
        value: 'zu',
        label: '祖鲁语'
      }
    ]
  }
  ]
}
// "googleLangMap":{"af":"南非荷兰语","sq":"阿尔巴尼亚语","am":"阿姆哈拉语","ar":"阿拉伯语","hy":"亚美尼亚语","az":"阿塞拜疆语","eu":"巴斯克语","be":"白俄罗斯语","bn":"孟加拉语","bs":"波斯尼亚语","bg":"保加利亚语","ca":"加泰罗尼亚语","ceb":"宿务语","zh":"华文（简体）","co":"科西嘉语","hr":"克罗地亚语","cs":"捷克语","da":"丹麦语","nl":"荷兰语","en":"英语","eo":"世界语","et":"爱沙尼亚语","fi":"芬兰语","fr":"法语","fy":"弗里斯兰语","gl":"加利西亚语","ka":"格鲁吉亚语","de":"德语","el":"希腊语","gu":"古吉拉特语","ht":"海地克里奥尔语","ha":"豪萨语","haw":"夏威夷语","he":"希伯来语","hi":"印地语","hmn":"苗语","hu":"匈牙利语","is":"冰岛语","ig":"伊博语","id":"印度尼西亚语","ga":"爱尔兰语","it":"意大利语","ja":"日语","jv":"爪哇语","kn":"卡纳达语","kk":"哈萨克语","km":"高棉语","ko":"韩语","ku":"库尔德语","ky":"吉尔吉斯语","lo":"老挝语","la":"拉丁文","lv":"拉脱维亚语","lt":"立陶宛语","lb":"卢森堡语","mk":"马其顿语","mg":"马尔加什语","ms":"马来语","ml":"马拉雅拉姆文","mt":"马耳他语","mi":"毛利语","mr":"马拉地语","mn":"蒙古文","my":"缅甸语","ne":"尼泊尔语","no":"挪威语","ny":"尼杨扎语（齐切瓦语）","ps":"普什图语","fa":"波斯语","pl":"波兰语","pt":"葡萄牙语（葡萄牙、巴西）","pa":"旁遮普语","ro":"罗马尼亚语","ru":"俄语","sm":"萨摩亚语","gd":"苏格兰盖尔语","sr":"塞尔维亚语","st":"塞索托语","sn":"修纳语","sd":"信德语","si":"僧伽罗语","sk":"斯洛伐克语","sl":"斯洛文尼亚语","so":"索马里语","es":"西班牙语","su":"巽他语","sw":"斯瓦希里语","sv":"瑞典语","tl":"塔加路语（菲律宾语）","tg":"塔吉克语","ta":"泰米尔语","te":"泰卢固语","th":"泰文","tr":"土耳其语","uk":"乌克兰语","ur":"乌尔都语","uz":"乌兹别克语","vi":"越南语","cy":"威尔士语","xh":"班图语","yi":"意第绪语","yo":"约鲁巴语","zu":"祖鲁语"},"deeplLangMap":{"bg":"保加利亚语","cs":"捷克语","da":"丹麦语","de":"德语","el":"希腊语","en_gb":"英语（英国）","en_us":"英语（美国）","es":"西班牙语","et":"爱沙尼亚语","fi":"芬兰语","fr":"法语","hu":"匈牙利语","it":"意大利语","ja":"日语","lt":"立陶宛语","lv":"拉脱维亚语","nl":"荷兰语","pl":"波兰语","pt_pt":"葡萄牙语","pt_br":"葡萄牙语（巴西）","ro":"罗马尼亚语","ru":"俄语","sk":"斯洛伐克语","sl":"斯洛文尼亚语","sv":"瑞典语","zh":"中文","en":"英语","pt":"葡萄牙语"},

export function iconJson() {
  return [
    'user-solid', 'user', 'phone', 'office-building', 'delete', 's-tools', 'info', 'school', 'star-on', 'bank-card', 'discount', 'guide',
    'female', 'link', 'menu', 'monitor', 'set-up', 'chat-line-square', 'message', 'postcard', 'position', 'turn-off-microphone', 'notebook-2', 'odometer', 'full-screen', 'clock', 'lock', 'unlock', 'key', 'service', 'truck', 'mobile-phone', 'ship', 'lightning', 'moon', 'location-outline', 'folder-opened', 'folder', 'edit', 'edit-outline', 'loading', 'close', 'check'
  ];
  return [
    'ios-add', 'md-add', 'ios-add-circle', 'ios-add-circle-outline', 'md-add-circle', 'ios-alarm', 'ios-alarm-outline', 'md-alarm', 'ios-albums', 'ios-albums-outline', 'md-albums', 'ios-alert', 'ios-alert-outline', 'md-alert', 'ios-american-football', 'ios-american-football-outline', 'md-american-football', 'ios-analytics', 'ios-analytics-outline', 'md-analytics', 'logo-android', 'logo-angular', 'ios-aperture', 'ios-aperture-outline', 'md-aperture', 'logo-apple', 'ios-apps', 'ios-apps-outline', 'md-apps', 'ios-appstore', 'ios-appstore-outline', 'md-appstore', 'ios-archive', 'ios-archive-outline', 'md-archive', 'ios-arrow-back', 'md-arrow-back', 'ios-arrow-down', 'md-arrow-down', 'ios-arrow-dropdown', 'md-arrow-dropdown', 'ios-arrow-dropdown-circle', 'md-arrow-dropdown-circle', 'ios-arrow-dropleft', 'md-arrow-dropleft', 'ios-arrow-dropleft-circle', 'md-arrow-dropleft-circle', 'ios-arrow-dropright', 'md-arrow-dropright', 'ios-arrow-dropright-circle', 'md-arrow-dropright-circle', 'ios-arrow-dropup', 'md-arrow-dropup', 'ios-arrow-dropup-circle', 'md-arrow-dropup-circle', 'ios-arrow-forward', 'md-arrow-forward', 'ios-arrow-round-back', 'md-arrow-round-back', 'ios-arrow-round-down', 'md-arrow-round-down', 'ios-arrow-round-forward', 'md-arrow-round-forward', 'ios-arrow-round-up', 'md-arrow-round-up', 'ios-arrow-up', 'md-arrow-up', 'ios-at', 'ios-at-outline', 'md-at', 'ios-attach', 'md-attach', 'ios-backspace', 'ios-backspace-outline', 'md-backspace', 'ios-barcode', 'ios-barcode-outline', 'md-barcode', 'ios-baseball', 'ios-baseball-outline', 'md-baseball', 'ios-basket', 'ios-basket-outline', 'md-basket', 'ios-basketball', 'ios-basketball-outline', 'md-basketball', 'ios-battery-charging', 'md-battery-charging', 'ios-battery-dead', 'md-battery-dead', 'ios-battery-full', 'md-battery-full', 'ios-beaker', 'ios-beaker-outline', 'md-beaker', 'ios-beer', 'ios-beer-outline', 'md-beer', 'ios-bicycle', 'md-bicycle', 'logo-bitcoin', 'ios-bluetooth', 'md-bluetooth', 'ios-boat', 'ios-boat-outline', 'md-boat', 'ios-body', 'ios-body-outline', 'md-body', 'ios-bonfire', 'ios-bonfire-outline', 'md-bonfire', 'ios-book', 'ios-book-outline', 'md-book', 'ios-bookmark', 'ios-bookmark-outline', 'md-bookmark', 'ios-bookmarks', 'ios-bookmarks-outline', 'md-bookmarks', 'ios-bowtie', 'ios-bowtie-outline', 'md-bowtie', 'ios-briefcase', 'ios-briefcase-outline', 'md-briefcase', 'ios-browsers', 'ios-browsers-outline', 'md-browsers', 'ios-brush', 'ios-brush-outline', 'md-brush', 'logo-buffer', 'ios-bug', 'ios-bug-outline', 'md-bug', 'ios-build', 'ios-build-outline', 'md-build', 'ios-bulb', 'ios-bulb-outline', 'md-bulb', 'ios-bus', 'ios-bus-outline', 'md-bus', 'ios-cafe', 'ios-cafe-outline', 'md-cafe', 'ios-calculator', 'ios-calculator-outline', 'md-calculator', 'ios-calendar', 'ios-calendar-outline', 'md-calendar', 'ios-call', 'ios-call-outline', 'md-call', 'ios-camera', 'ios-camera-outline', 'md-camera', 'ios-car', 'ios-car-outline', 'md-car', 'ios-card', 'ios-card-outline', 'md-card', 'ios-cart', 'ios-cart-outline', 'md-cart', 'ios-cash', 'ios-cash-outline', 'md-cash', 'ios-chatboxes', 'ios-chatboxes-outline', 'md-chatboxes', 'ios-chatbubbles', 'ios-chatbubbles-outline', 'md-chatbubbles', 'ios-checkbox', 'ios-checkbox-outline', 'md-checkbox', 'md-checkbox-outline', 'ios-checkmark', 'md-checkmark', 'ios-checkmark-circle', 'ios-checkmark-circle-outline', 'md-checkmark-circle', 'md-checkmark-circle-outline', 'logo-chrome', 'ios-clipboard', 'ios-clipboard-outline', 'md-clipboard', 'ios-clock', 'ios-clock-outline', 'md-clock', 'ios-close', 'md-close', 'ios-close-circle', 'ios-close-circle-outline', 'md-close-circle', 'ios-closed-captioning', 'ios-closed-captioning-outline', 'md-closed-captioning', 'ios-cloud', 'ios-cloud-outline', 'md-cloud', 'ios-cloud-circle', 'ios-cloud-circle-outline', 'md-cloud-circle', 'ios-cloud-done', 'ios-cloud-done-outline', 'md-cloud-done', 'ios-cloud-download', 'ios-cloud-download-outline', 'md-cloud-download', 'md-cloud-outline', 'ios-cloud-upload', 'ios-cloud-upload-outline', 'md-cloud-upload', 'ios-cloudy', 'ios-cloudy-outline', 'md-cloudy', 'ios-cloudy-night', 'ios-cloudy-night-outline', 'md-cloudy-night', 'ios-code', 'md-code', 'ios-code-download', 'md-code-download', 'ios-code-working', 'md-code-working', 'logo-codepen', 'ios-cog', 'ios-cog-outline', 'md-cog', 'ios-color-fill', 'ios-color-fill-outline', 'md-color-fill', 'ios-color-filter', 'ios-color-filter-outline', 'md-color-filter', 'ios-color-palette', 'ios-color-palette-outline', 'md-color-palette', 'ios-color-wand', 'ios-color-wand-outline', 'md-color-wand', 'ios-compass', 'ios-compass-outline', 'md-compass', 'ios-construct', 'ios-construct-outline', 'md-construct', 'ios-contact', 'ios-contact-outline', 'md-contact', 'ios-contacts', 'ios-contacts-outline', 'md-contacts', 'ios-contract', 'md-contract', 'ios-contrast', 'md-contrast', 'ios-copy', 'ios-copy-outline', 'md-copy', 'ios-create', 'ios-create-outline', 'md-create', 'ios-crop', 'ios-crop-outline', 'md-crop', 'logo-css3', 'ios-cube', 'ios-cube-outline', 'md-cube', 'ios-cut', 'ios-cut-outline', 'md-cut', 'logo-designernews', 'ios-desktop', 'ios-desktop-outline', 'md-desktop', 'ios-disc', 'ios-disc-outline', 'md-disc', 'ios-document', 'ios-document-outline', 'md-document', 'ios-done-all', 'md-done-all', 'ios-download', 'ios-download-outline', 'md-download', 'logo-dribbble', 'logo-dropbox', 'ios-easel', 'ios-easel-outline', 'md-easel', 'ios-egg', 'ios-egg-outline', 'md-egg', 'logo-euro', 'ios-exit', 'ios-exit-outline', 'md-exit', 'ios-expand', 'md-expand', 'ios-eye', 'ios-eye-outline', 'md-eye', 'ios-eye-off', 'ios-eye-off-outline', 'md-eye-off', 'logo-facebook', 'ios-fastforward', 'ios-fastforward-outline', 'md-fastforward', 'ios-female', 'md-female', 'ios-filing', 'ios-filing-outline', 'md-filing', 'ios-film', 'ios-film-outline', 'md-film', 'ios-finger-print', 'md-finger-print', 'ios-flag', 'ios-flag-outline', 'md-flag', 'ios-flame', 'ios-flame-outline', 'md-flame', 'ios-flash', 'ios-flash-outline', 'md-flash', 'ios-flask', 'ios-flask-outline', 'md-flask', 'ios-flower', 'ios-flower-outline', 'md-flower', 'ios-folder', 'ios-folder-outline', 'md-folder', 'ios-folder-open', 'ios-folder-open-outline', 'md-folder-open', 'ios-football', 'ios-football-outline', 'md-football', 'logo-foursquare', 'logo-freebsd-devil', 'ios-funnel', 'ios-funnel-outline', 'md-funnel', 'ios-game-controller-a', 'ios-game-controller-a-outline', 'md-game-controller-a', 'ios-game-controller-b', 'ios-game-controller-b-outline', 'md-game-controller-b', 'ios-git-branch', 'md-git-branch', 'ios-git-commit', 'md-git-commit', 'ios-git-compare', 'md-git-compare', 'ios-git-merge', 'md-git-merge', 'ios-git-network', 'md-git-network', 'ios-git-pull-request', 'md-git-pull-request', 'logo-github', 'ios-glasses', 'ios-glasses-outline', 'md-glasses', 'ios-globe', 'ios-globe-outline', 'md-globe', 'logo-google', 'logo-googleplus', 'ios-grid', 'ios-grid-outline', 'md-grid', 'logo-hackernews', 'ios-hammer', 'ios-hammer-outline', 'md-hammer', 'ios-hand', 'ios-hand-outline', 'md-hand', 'ios-happy', 'ios-happy-outline', 'md-happy', 'ios-headset', 'ios-headset-outline', 'md-headset', 'ios-heart', 'ios-heart-outline', 'md-heart', 'md-heart-outline', 'ios-help', 'md-help', 'ios-help-buoy', 'ios-help-buoy-outline', 'md-help-buoy', 'ios-help-circle', 'ios-help-circle-outline', 'md-help-circle', 'ios-home', 'ios-home-outline', 'md-home', 'logo-html5', 'ios-ice-cream', 'ios-ice-cream-outline', 'md-ice-cream', 'ios-image', 'ios-image-outline', 'md-image', 'ios-images', 'ios-images-outline', 'md-images', 'ios-infinite', 'ios-infinite-outline', 'md-infinite', 'ios-information', 'md-information', 'ios-information-circle', 'ios-information-circle-outline', 'md-information-circle', 'logo-instagram', 'ios-ionic', 'ios-ionic-outline', 'md-ionic', 'ios-ionitron', 'ios-ionitron-outline', 'md-ionitron', 'logo-javascript', 'ios-jet', 'ios-jet-outline', 'md-jet', 'ios-key', 'ios-key-outline', 'md-key', 'ios-keypad', 'ios-keypad-outline', 'md-keypad', 'ios-laptop', 'md-laptop', 'ios-leaf', 'ios-leaf-outline', 'md-leaf', 'ios-link', 'ios-link-outline', 'md-link', 'logo-linkedin', 'ios-list', 'md-list', 'ios-list-box', 'ios-list-box-outline', 'md-list-box', 'ios-locate', 'ios-locate-outline', 'md-locate', 'ios-lock', 'ios-lock-outline', 'md-lock', 'ios-log-in', 'md-log-in', 'ios-log-out', 'md-log-out', 'ios-magnet', 'ios-magnet-outline', 'md-magnet', 'ios-mail', 'ios-mail-outline', 'md-mail', 'ios-mail-open', 'ios-mail-open-outline', 'md-mail-open', 'ios-male', 'md-male', 'ios-man', 'ios-man-outline', 'md-man', 'ios-map', 'ios-map-outline', 'md-map', 'logo-markdown', 'ios-medal', 'ios-medal-outline', 'md-medal', 'ios-medical', 'ios-medical-outline', 'md-medical', 'ios-medkit', 'ios-medkit-outline', 'md-medkit', 'ios-megaphone', 'ios-megaphone-outline', 'md-megaphone', 'ios-menu', 'ios-menu-outline', 'md-menu', 'ios-mic', 'ios-mic-outline', 'md-mic', 'ios-mic-off', 'ios-mic-off-outline', 'md-mic-off', 'ios-microphone', 'ios-microphone-outline', 'md-microphone', 'ios-moon', 'ios-moon-outline', 'md-moon', 'ios-more', 'ios-more-outline', 'md-more', 'ios-move', 'md-move', 'ios-musical-note', 'ios-musical-note-outline', 'md-musical-note', 'ios-musical-notes', 'ios-musical-notes-outline', 'md-musical-notes', 'ios-navigate', 'ios-navigate-outline', 'md-navigate', 'ios-no-smoking', 'ios-no-smoking-outline', 'md-no-smoking', 'logo-nodejs', 'ios-notifications', 'ios-notifications-outline', 'md-notifications', 'ios-notifications-off', 'ios-notifications-off-outline', 'md-notifications-off', 'md-notifications-outline', 'ios-nuclear', 'ios-nuclear-outline', 'md-nuclear', 'ios-nutrition', 'ios-nutrition-outline', 'md-nutrition', 'logo-octocat', 'ios-open', 'ios-open-outline', 'md-open', 'ios-options', 'ios-options-outline', 'md-options', 'ios-outlet', 'ios-outlet-outline', 'md-outlet', 'ios-paper', 'ios-paper-outline', 'md-paper', 'ios-paper-plane', 'ios-paper-plane-outline', 'md-paper-plane', 'ios-partly-sunny', 'ios-partly-sunny-outline', 'md-partly-sunny', 'ios-pause', 'ios-pause-outline', 'md-pause', 'ios-paw', 'ios-paw-outline', 'md-paw', 'ios-people', 'ios-people-outline', 'md-people', 'ios-person', 'ios-person-outline', 'md-person', 'ios-person-add', 'ios-person-add-outline', 'md-person-add', 'ios-phone-landscape', 'md-phone-landscape', 'ios-phone-portrait', 'md-phone-portrait', 'ios-photos', 'ios-photos-outline', 'md-photos', 'ios-pie', 'ios-pie-outline', 'md-pie', 'ios-pin', 'ios-pin-outline', 'md-pin', 'ios-pint', 'ios-pint-outline', 'md-pint', 'logo-pinterest', 'ios-pizza', 'ios-pizza-outline', 'md-pizza', 'ios-plane', 'ios-plane-outline', 'md-plane', 'ios-planet', 'ios-planet-outline', 'md-planet', 'ios-play', 'ios-play-outline', 'md-play', 'logo-playstation', 'ios-podium', 'ios-podium-outline', 'md-podium', 'ios-power', 'ios-power-outline', 'md-power', 'ios-pricetag', 'ios-pricetag-outline', 'md-pricetag', 'ios-pricetags', 'ios-pricetags-outline', 'md-pricetags', 'ios-print', 'ios-print-outline', 'md-print', 'ios-pulse', 'ios-pulse-outline', 'md-pulse', 'logo-python', 'ios-qr-scanner', 'md-qr-scanner', 'ios-quote', 'ios-quote-outline', 'md-quote', 'ios-radio', 'ios-radio-outline', 'md-radio', 'ios-radio-button-off', 'md-radio-button-off', 'ios-radio-button-on', 'md-radio-button-on', 'ios-rainy', 'ios-rainy-outline', 'md-rainy', 'ios-recording', 'ios-recording-outline', 'md-recording', 'logo-reddit', 'ios-redo', 'ios-redo-outline', 'md-redo', 'ios-refresh', 'md-refresh', 'ios-refresh-circle', 'ios-refresh-circle-outline', 'md-refresh-circle', 'ios-remove', 'md-remove', 'ios-remove-circle', 'ios-remove-circle-outline', 'md-remove-circle', 'ios-reorder', 'md-reorder', 'ios-repeat', 'md-repeat', 'ios-resize', 'md-resize', 'ios-restaurant', 'ios-restaurant-outline', 'md-restaurant', 'ios-return-left', 'md-return-left', 'ios-return-right', 'md-return-right', 'ios-reverse-camera', 'ios-reverse-camera-outline', 'md-reverse-camera', 'ios-rewind', 'ios-rewind-outline', 'md-rewind', 'ios-ribbon', 'ios-ribbon-outline', 'md-ribbon', 'ios-rose', 'ios-rose-outline', 'md-rose', 'logo-rss', 'ios-sad', 'ios-sad-outline', 'md-sad', 'logo-sass', 'ios-school', 'ios-school-outline', 'md-school', 'ios-search', 'ios-search-outline', 'md-search', 'ios-send', 'ios-send-outline', 'md-send', 'ios-settings', 'ios-settings-outline', 'md-settings', 'ios-share', 'ios-share-outline', 'md-share', 'ios-share-alt', 'ios-share-alt-outline', 'md-share-alt', 'ios-shirt', 'ios-shirt-outline', 'md-shirt', 'ios-shuffle', 'md-shuffle', 'ios-skip-backward', 'ios-skip-backward-outline', 'md-skip-backward', 'ios-skip-forward', 'ios-skip-forward-outline', 'md-skip-forward', 'logo-skype', 'logo-snapchat', 'ios-snow', 'ios-snow-outline', 'md-snow', 'ios-speedometer', 'ios-speedometer-outline', 'md-speedometer', 'ios-square', 'ios-square-outline', 'md-square', 'md-square-outline', 'ios-star', 'ios-star-outline', 'md-star', 'ios-star-half', 'md-star-half', 'md-star-outline', 'ios-stats', 'ios-stats-outline', 'md-stats', 'logo-steam', 'ios-stopwatch', 'ios-stopwatch-outline', 'md-stopwatch', 'ios-subway', 'ios-subway-outline', 'md-subway', 'ios-sunny', 'ios-sunny-outline', 'md-sunny', 'ios-swap', 'md-swap', 'ios-switch', 'ios-switch-outline', 'md-switch', 'ios-sync', 'md-sync', 'ios-tablet-landscape', 'md-tablet-landscape', 'ios-tablet-portrait', 'md-tablet-portrait', 'ios-tennisball', 'ios-tennisball-outline', 'md-tennisball', 'ios-text', 'ios-text-outline', 'md-text', 'ios-thermometer', 'ios-thermometer-outline', 'md-thermometer', 'ios-thumbs-down', 'ios-thumbs-down-outline', 'md-thumbs-down', 'ios-thumbs-up', 'ios-thumbs-up-outline', 'md-thumbs-up', 'ios-thunderstorm', 'ios-thunderstorm-outline', 'md-thunderstorm', 'ios-time', 'ios-time-outline', 'md-time', 'ios-timer', 'ios-timer-outline', 'md-timer', 'ios-train', 'ios-train-outline', 'md-train', 'ios-transgender', 'md-transgender', 'ios-trash', 'ios-trash-outline', 'md-trash', 'ios-trending-down', 'md-trending-down', 'ios-trending-up', 'md-trending-up', 'ios-trophy', 'ios-trophy-outline', 'md-trophy', 'logo-tumblr', 'logo-tux', 'logo-twitch', 'logo-twitter', 'ios-umbrella', 'ios-umbrella-outline', 'md-umbrella', 'ios-undo', 'ios-undo-outline', 'md-undo', 'ios-unlock', 'ios-unlock-outline', 'md-unlock', 'logo-usd', 'ios-videocam', 'ios-videocam-outline', 'md-videocam', 'logo-vimeo', 'ios-volume-down', 'md-volume-down', 'ios-volume-mute', 'md-volume-mute', 'ios-volume-off', 'md-volume-off', 'ios-volume-up', 'md-volume-up', 'ios-walk', 'md-walk', 'ios-warning', 'ios-warning-outline', 'md-warning', 'ios-watch', 'md-watch', 'ios-water', 'ios-water-outline', 'md-water', 'logo-whatsapp', 'ios-wifi', 'ios-wifi-outline', 'md-wifi', 'logo-windows', 'ios-wine', 'ios-wine-outline', 'md-wine', 'ios-woman', 'ios-woman-outline', 'md-woman', 'logo-wordpress', 'logo-xbox', 'logo-yahoo', 'logo-yen', 'logo-youtube', 'ios-loading'
  ]
}

export default {
  resetTime,
  emoji_icon,
  newsTime,
}

// 通过val 拿到label
export function getLabelByVal(str, data, optionItem = { value: 'value', label: 'label' }) {
  let label = ''
  if (!data) return label;
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item[optionItem.value] === str) {
        label = item[optionItem.label]
      }
    })
  } else {
    label = data[optionItem.value] ? data[optionItem.value] : ''
  }
  return label
}

// 通过label 拿到 val
export function getValByLabel(str, data, optionItem = { value: 'value', label: 'label' }) {
  let label = ''
  if (!data) return label;
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item[optionItem.label] === str) {
        label = item[optionItem.value]
      }
    })
  } else {
    label = data[optionItem.label] ? data[optionItem.label] : ''
  }
  return label
}

// 通过val arr 拿到label
export function getLabelArrByVal(arr, data, optionItem = { value: 'value', label: 'label' }) {
  // console.log('arr', arr)
  // console.log('data', data)
  let labelArr = []
  if (Array.isArray(data) && Array.isArray(arr)) {
    arr.forEach(item => {
      data.forEach(val => {
        if (val[optionItem.value] === item) {
          labelArr.push(val[optionItem.label])
        }
      })
    })
  } else {
    labelArr = []
  }

  return labelArr.join(',')
}

// 通过label arr 拿到val
export function getValArrByLabel(arr, data, optionItem = { value: 'value', label: 'label' }) {
  // console.log('arr', arr)
  // console.log('data', data)
  let labelArr = []
  if (Array.isArray(data) && Array.isArray(arr)) {
    arr.forEach(item => {
      data.forEach(val => {
        if (val[optionItem.label] === item) {
          labelArr.push(val[optionItem.value])
        }
      })
    })
  } else {
    labelArr = []
  }

  return labelArr.join(',')
}

// 复制
export function copyText(value, that){
  const aux = document.createElement('input')
  aux.setAttribute('value', value)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
  that.$message.success('复制成功')
}
