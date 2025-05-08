const { test, expect } = require('@playwright/test')
const { parseColor } = require('./util')

test('parseColor basic', async ({}) => {
  await expect(parseColor('')).toEqual('')
  await expect(parseColor('red')).toEqual('red')
  await expect(parseColor('#ff0000')).toEqual('#ff0000')
})

test('parseColor linearGradient', async ({}) => {
  await expect(parseColor('linearGradient: 0% #ffd700, 50% #000000 0, 100% #ffd700')).toEqual({
    gradient: 'linearGradient',
    stops: [
      { offset: '0%', 'stop-color': '#ffd700', 'stop-opacity': 1 },
      { offset: '50%', 'stop-color': '#000000', 'stop-opacity': 0 },
      { offset: '100%', 'stop-color': '#ffd700', 'stop-opacity': 1 },
    ],
  })
})

test('parseColor radialGradient', async ({}) => {
  await expect(parseColor('radialGradient: 0% #ffd700, 50% #000000 0, 100% #ffd700')).toEqual({
    gradient: 'radialGradient',
    stops: [
      { offset: '0%', 'stop-color': '#ffd700', 'stop-opacity': 1 },
      { offset: '50%', 'stop-color': '#000000', 'stop-opacity': 0 },
      { offset: '100%', 'stop-color': '#ffd700', 'stop-opacity': 1 },
    ],
  })
})
