import { Circle, Rectangle, Shape } from './modules/shape/index.js'
import { Shape as Shape2 } from 'shape'
import { Shape as Shape3 } from 'shape/Shape.js'
import { getLangs, log } from './modules/util/log.js'
import cube, * as math from './modules/util/math.js'
import config from "./modules/resource/config.json" with { type: "json" }
import style from "./modules/resource/style.css" with { type: "css" }

document.addEventListener('DOMContentLoaded', async () => {
  log('log', 'hello esmodule')

  log('PI', math.PI)
  log('square', math.square(2))

  log('cube1', math.default(2))
  log('cube2', cube(2))

  log('shape1', new Shape().area)
  log('rectangle1', new Rectangle(2, 3).area)

  log('circle1', new Circle(1).area)
  log('circle2', new Circle(2).area)

  log('global1', UNIT)

  log('langs', (await getLangs()).join(','))
  
  log('config', JSON.stringify(config))

  // console.log(style)
  log('style', style.cssRules[0].selectorText)

  log('shape2', new Shape2().area)

  log('shape3', new Shape3().area)

  const data = (await Promise.all([
    import('./modules/data/zh.json', {with:{type:'json'}}),
    import('./modules/data/en.json', {with:{type:'json'}}),
    import('./modules/data/fr.json', {with:{type:'json'}}),
  ])).map(mod=> mod.default).reduce((prev, cur)=> Object.assign(prev, cur), {})
  log('data', JSON.stringify(data))
})
