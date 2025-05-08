import {
  BodyData,
  SHOW_DETAIL,
  eventBus,
  EventEmitter,
  GOTO_PLANET_SYSTEM,
  GOTO_STAR_SYSTEM,
  PAUSE,
  PlanetData,
  RESUME,
  StarData,
  SVG_NS,
  HIDE_DETAIL,
  INSERT_RESOURCE,
  randomInt,
} from './util'
import starData from '../assets/data.json'
import { CenterBody } from './CenterBody'
import { SubBody } from './SubBody'

export class System extends EventEmitter {
  /** @type {CenterBody} */
  centerbody

  /**
   * @param {StarData | PlanetData} data
   * @param {SVGElement} svg
   */
  constructor(data, svg) {
    super()

    const root = svg.querySelector('g#systemRoot')
    const defs = svg.querySelector('#systemDefs')
    if (!root || !defs) return

    defs.innerHTML = ''
    root.innerHTML = ''
    const centerbody = new CenterBody(data, { x: 80, y: 80 })
    this.centerbody = centerbody
    root.append(centerbody.group)
    // @ts-ignore
    svg.unpauseAnimations()
  }

  static init() {
    const detailId = 'detailPanel'
    /** @type {SVGElement} */
    // @ts-ignore
    const svg = document.querySelector('svg.system')
    const defs = svg.querySelector('#systemDefs')
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const tailEnabled = svg.querySelector('#tailEnabled')
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const orbitEnabled = svg.querySelector('#orbitEnabled')
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const speed = svg.querySelector('#speed')
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const bgEnabled = svg.querySelector('#bgEnabled')
    /** @type {SVGImageElement} */
    // @ts-ignore
    const bg = svg.querySelector('#bg')
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const comet = svg.querySelector('#comet')

    if (!svg || !defs || !tailEnabled || !orbitEnabled || !speed || !bgEnabled || !bg || !comet)
      return

    /** @type {System} */
    let starSystem

    eventBus.on(PAUSE, () => {
      // @ts-ignore
      svg.pauseAnimations()
    })

    eventBus.on(RESUME, () => {
      // @ts-ignore
      svg.unpauseAnimations()
    })

    eventBus.on(
      SHOW_DETAIL,
      /**  @param {CenterBody | SubBody} body */
      (body) => {
        // console.trace(body)
        let detail = svg.querySelector(`#${detailId}`)
        if (!detail) {
          detail = document.createElementNS(SVG_NS, 'foreignObject')
          svg.append(detail)
          detail.setAttribute('id', detailId)
          detail.setAttribute('x', '0')
          detail.setAttribute('y', '0')
          detail.setAttribute('width', '25%')
          detail.setAttribute('height', '40%')
        }

        const tb = ['<table>']
        tb.push(`<tr><td>Type:</td><td>${body.data.type}</td></tr>`)
        tb.push(`<tr><td>Name:</td><td>${body.data.name}</td></tr>`)
        if (body.data.bodies.length) {
          const bodies = body.data.bodies.map((b) => `<li class="item">◎ ${b.name}</li>`).join('')
          tb.push(`<tr><td>Bodies:</td><td><ul>${bodies}</ul></td></tr>`)
        }
        tb.push('</table>')
        detail.innerHTML = tb.join('')

        detail.querySelectorAll('.item').forEach((item, i) => {
          const subbody = body.bodies[i]
          if (!subbody) return
          // console.log(i, subbody)
          const isPlanet = subbody.data.type === 'planet'
          item.addEventListener('mouseenter', () => {
            subbody.highlight()
          })
          item.addEventListener('mouseleave', () => {
            subbody.unhighlight()
          })
          if (isPlanet) {
            item.classList.add('link')
            item.addEventListener('click', () => {
              eventBus.emit(GOTO_PLANET_SYSTEM, subbody.data)
            })
          }
        })

        // @ts-ignore
        detail.style.display = 'block'
      }
    )

    eventBus.on(HIDE_DETAIL, () => {
      const detail = svg.querySelector(`#${detailId}`)
      if (detail) {
        // @ts-ignore
        detail.style.display = 'none'
      }
    })

    eventBus.on(
      GOTO_PLANET_SYSTEM,
      /**  @param {PlanetData} planetData */
      (planetData) => {
        console.log(GOTO_PLANET_SYSTEM, planetData)
        new System(planetData, svg)
        comet.disabled = true
      }
    )

    eventBus.on(INSERT_RESOURCE, (res) => {
      defs.append(res)
    })

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        !document.querySelector('.centerbody')?.classList.contains('star')
      ) {
        console.log(GOTO_STAR_SYSTEM, starData)
        starSystem = new System(starData, svg)
        comet.disabled = false
      }
    })

    tailEnabled.addEventListener('change', () => {
      if (tailEnabled.checked) {
        svg.querySelectorAll('.tail').forEach((tail) => {
          // @ts-ignore
          tail.style.display = 'block'
        })
      } else {
        svg.querySelectorAll('.tail').forEach((tail) => {
          // @ts-ignore
          tail.style.display = 'none'
        })
      }
    })

    orbitEnabled.addEventListener('change', () => {
      if (orbitEnabled.checked) {
        svg.querySelectorAll('.orbit').forEach((orbit) => {
          // @ts-ignore
          orbit.style.display = 'block'
        })
      } else {
        svg.querySelectorAll('.orbit').forEach((orbit) => {
          // @ts-ignore
          orbit.style.display = 'none'
        })
      }
    })

    let oldSpeed = parseFloat(speed.value)
    speed.addEventListener('change', () => {
      const factor = parseFloat(speed.value) / oldSpeed
      svg.querySelectorAll('animateMotion').forEach((el) => {
        el.setAttribute('dur', `${parseFloat(el.getAttribute('dur') ?? '0') / factor}s`)
      })

      oldSpeed = parseFloat(speed.value)
    })

    bgEnabled.addEventListener('change', () => {
      bg.style.display = bgEnabled.checked ? 'block' : 'none'
    })

    comet.addEventListener('click', () => {
      // console.log(starSystem)

      const name = prompt('Comet name:')
      if (!name) return
      starSystem.centerbody.addSubbody({
        type: 'comet',
        name,
        r: 0.3,
        rx: randomInt(60, 80),
        ry: randomInt(2, 4),
        dur: randomInt(200, 400),
        color: ['red', 'yellow', 'blue'][randomInt(0, 2)],
        bodies: [],
      })
    })

    starSystem = new System(starData, svg)
  }
}
