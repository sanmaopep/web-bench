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
