const theme = 'default'

export const themes = {
  default: {
    colors: ['#6083E7', '#DB746B', '#68D5BE', '#445DA3', '#9B524B', '#BDC0C2'],
  },
  dark: {
    colors: ['#BDCCF4', '#BBE3F5', '#B8EAE1', '#C0E7B4', '#DFEB9E', '#F2E4AF'],
  },
}

export function getColor(index) {
  const colors = themes[theme].colors
  return colors[index % colors.length]
}

export const col = getColor
