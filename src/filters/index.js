// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 将秒级时间戳格式化为日期字符串
 * @param {number} timestamp - 秒级时间戳
 * @param isM {boolean} 是否为毫秒
 * @param {string} [separator='-'] - 日期分隔符，默认为'-'
 * @returns {string} 格式化后的日期字符串，格式为YYYY-MM-DD HH:mm:ss
 */
export function formatTimestamp(timestamp, isM = false, separator = '-',) {
  if (timestamp) {
    let date = 0
    if (isM) {
      date = new Date(timestamp);
    } else {
      // 转换为毫秒并创建Date对象
      date = new Date(timestamp * 1000);
    }

    // 提取日期时间组件
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份补零
    const day = String(date.getDate()).padStart(2, '0'); // 日期补零
    const hours = String(date.getHours()).padStart(2, '0'); // 小时补零
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 分钟补零
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 秒补零

    // 拼接日期时间字符串
    return `${year}${separator}${month}${separator}${day} ${hours}:${minutes}:${seconds}`;
  } else {
    return '-'
  }
}

export function getFileExtension(input) {
  if (typeof input !== 'string' || !input) return '';

  // 处理路径并提取纯文件名（兼容Windows和Unix路径）
  const filename = input.split(/[\\/]/).pop() || '';

  // 查找最后一个有效点符号
  const lastDotIndex = filename.lastIndexOf('.');

  // 排除以下无效情况：
  // 1. 无后缀（如 `file`）
  // 2. 隐藏文件无后缀（如 `.gitignore`）
  // 3. 以点结尾的无效后缀（如 `file.`）
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === filename.length - 1) {
    return '';
  }

  // 提取后缀并统一小写（如 `JPG` → `jpg`）
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * 10000 => "123.456"
 * @param {number} num
 */
export function formatDecimal(num) {
  // 检查是否为数字
  if (typeof num !== 'number' || isNaN(num)) {
    return num; // 如果不是有效数字，直接返回
  }

  // 检查是否为整数
  if (Number.isInteger(num)) {
    return num; // 如果是整数，直接返回
  }

  // 是小数，保留两位小数
  return parseFloat(num.toFixed(2));
}
