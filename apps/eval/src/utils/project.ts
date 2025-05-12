import { readdir, readFile, stat } from 'promise-fs'
import path from 'path'

export const getStableProject = async () => {
  const projectRoot = path.join(__dirname, '../../../projects/')

  const allProjects = await readdir(projectRoot)

  const projectStats = await Promise.all(
    allProjects.map((p) => {
      return stat(path.join(projectRoot, p))
    })
  )

  const projects = allProjects.filter((_, i) => projectStats[i].isDirectory())

  const packageJsons = await Promise.all(
    projects.map((p) =>
      readFile(path.join(projectRoot, p, 'package.json'), {
        encoding: 'utf-8',
      }).catch((e) => {
        return undefined
      })
    )
  )

  return packageJsons
    .filter((json) => json && JSON.parse(json).eval?.stable)
    .map((json) => JSON.parse(json!).name)
}
