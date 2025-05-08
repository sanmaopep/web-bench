import { AgentEvent, AgentRequest, AgentResponse, IAgent } from '@web-bench/evaluator-types'
import EventEmitter from 'events'
import { HTTPLimit } from './limit'

export class HttpAgent implements IAgent {
  public endpoint: string

  public emitter = new EventEmitter<AgentEvent>()

  constructor(api: string) {
    this.endpoint = api
  }

  public get key() {
    return this.endpoint
  }

  public  async fetch(req: AgentRequest) {
    return await HTTPLimit.limit(() => fetch(new URL(this.endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })) 
  }

  async request(req: AgentRequest): Promise<AgentResponse> {
    let res: Response | undefined

    try {
      res = await fetch(new URL(this.endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
    } catch (error) {
      console.log('error', error)
    }
    console.log('request', res)

    if (res) {
      if (res.status !== 200) {
        throw Error(
          `HTTP client error: error code: ${res.status}, error message: ${res.statusText}`
        )
      }

      const data: AgentResponse = await res.json()
      this.emitter.emit('onRequest', JSON.stringify(req), JSON.stringify(data))

      return data
    }

    return {
      files: {},
    }
  }

  clone = () => {
    return new HttpAgent(this.endpoint)
  }
}
