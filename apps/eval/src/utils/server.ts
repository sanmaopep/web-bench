import express from 'express'
import { getEvaluatorConfig, getAgents } from '../base'

export const startServer = async () => {
  const port = 6077

  const app = express()

  app.use(express.json())

  const EvaluatorConfig = await getEvaluatorConfig({})

  // bench-agent server 这里的 agent 走的还是本地的，所以这里需要改成 local 来获取 agent
  EvaluatorConfig.agentMode = 'local'

  const agents = await getAgents(EvaluatorConfig)

  const defaultModel = EvaluatorConfig.models[0]

  const agent = agents.find((agent) => agent.model?.title === defaultModel) || agents[0]

  app.post('/message', async (req, res) => {
    const data = await agent.request(req.body)
    console.log('data', data, req.body)

    res.send(data)
  })

  app.listen(port, () => {
    console.log(`bench-agent server app listening on port ${port}`)
  })
}
