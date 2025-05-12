// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
