const { getWindowMirror } = require('@web-bench/test-util')

/**
 * 用来计算空间坐标是否可以连成一条线
 * 
 * true:
 * |---0---|
 * |---12--|
 * |---43--|
 * |--65---|
 * |--7----|
 * 
 * false:
 * |---0---|
 * |---12--|
 * |---43--|
 * |-------|
 * |--5----|
 */
export function checkIsInLine(currentPos, bodyMap) {
  if (Object.keys(bodyMap).length === 0) {
    return true;
  }

  const nCoo = `${currentPos[0]}:${currentPos[1] - 1}`;
  const sCoo = `${currentPos[0]}:${currentPos[1] + 1}`;
  const wCoo = `${currentPos[0] - 1}:${currentPos[1]}`;
  const eCoo = `${currentPos[0] + 1}:${currentPos[1]}`;

  const tempMatchList = [
    {
      coo: nCoo,
      target: bodyMap[nCoo]
    },
    {
      coo: sCoo,
      target: bodyMap[sCoo]
    },
    {
      coo: eCoo,
      target: bodyMap[eCoo]
    },
    {
      coo: wCoo,
      target: bodyMap[wCoo]
    },
  ].filter(v => v.target)

  if (tempMatchList.length === 0) {
    return false;
  }

  return tempMatchList.some(v => {
    const a = Object.keys(bodyMap).reduce((pre, cur) => {
      if (cur === v.coo) {
        return { ...pre }
      }
      return {
        ...pre,
        [cur]: true
      }
    }, {})
    return checkIsInLine(v.coo.split(':').map(Number), a)
  })
}

export async function getSnakeHead(page) {
  const { scene } = await getWindowMirror(page, 'scene');

  const snakeGroup = scene.children.find(c => c.name === 'snake');

  return snakeGroup.children?.find(child => {
    return child.name === 'snake_head';
  })
}