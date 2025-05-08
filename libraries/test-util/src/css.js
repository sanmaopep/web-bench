/**
 * @param {string} color
 * @returns
 */
function parseColorToHex(color) {
  // 判断是否为 HEX 格式
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  // 判断是否为 RGB 格式
  const rgbRegex = /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/
  // 判断是否为 RGBA 格式
  const rgbaRegex =
    /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]?\.\d+|[01])\s*\)$/

  if (hexRegex.test(color)) {
    // 如果是 HEX 格式，直接返回
    return color.toLowerCase()
  } else if (rgbRegex.test(color)) {
    // 如果是 RGB 格式，转换为 HEX
    const rgbValues = color.match(rgbRegex).slice(1, 4)
    const hexValues = rgbValues.map((value) => {
      const num = value.includes('%') ? Math.round(parseInt(value, 10) * 2.55) : parseInt(value, 10)
      return num.toString(16).padStart(2, '0')
    })
    return `#${hexValues.join('')}`
  } else if (rgbaRegex.test(color)) {
    // 如果是 RGBA 格式，转换为 HEX（忽略透明度）
    const rgbaValues = color.match(rgbaRegex).slice(1, 4)
    const hexValues = rgbaValues.map((value) => {
      const num = value.includes('%') ? Math.round(parseInt(value, 10) * 2.55) : parseInt(value, 10)
      return num.toString(16).padStart(2, '0')
    })
    return `#${hexValues.join('')}`
  } else {
    // 如果不是以上格式，返回 null 或抛出错误
    return null
  }
}

module.exports = {
  parseColorToHex,
}
