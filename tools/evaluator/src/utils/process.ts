import ChildProcess from 'node:child_process'

export const promiseSpawn = (
  ...param: Parameters<typeof ChildProcess.spawn>
): Promise<number | null> => {
  return new Promise(async (resolve, reject) => {
    const task = ChildProcess.spawn(...param)
    task.on('close', (code) => {
      // code 0 为 成功
      // 1 为失败
      resolve(code)
    })

    task.stdout?.on('data', (data) => {
      // console.log(data.toString());
    })

    task.on('error', (err) => {
      reject(err)
    })
  })
}
