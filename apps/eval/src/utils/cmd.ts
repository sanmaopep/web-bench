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

interface CmdConfig {
  key: string

  cmdName: string

  toValue?: (val: string) => any
}

export const getCmdConfigs = () => {
  const infos: CmdConfig[] = [
    {
      key: 'name',
      cmdName: 'name',
    },
    {
      key: 'retry',
      cmdName: 'retry',
      toValue(val) {
        return +val
      },
    },
    {
      key: 'logLevel',
      cmdName: 'logLevel',
    },
    {
      key: 'startTask',
      cmdName: 'start-task',
    },
    {
      key: 'endTask',
      cmdName: 'end-task',
    },
    {
      key: 'agentDir',
      cmdName: 'agent-dir',
    },
    {
      key: 'agentMode',
      cmdName: 'agent-mode',
    },
    {
      key: 'agentEndPoint',
      cmdName: 'agent-endpoint',
    },
    {
      key: 'projects',
      cmdName: 'package-names',
      toValue(val) {
        return val.split(',')
      },
    },
    {
      key: 'models',
      cmdName: 'models',
      toValue(val) {
        return val.split(',')
      },
    },
    {
      key: 'plugins',
      cmdName: 'plugins',
      toValue(val) {
        return val.split(',')
      },
    },
  ]

  return infos
}
