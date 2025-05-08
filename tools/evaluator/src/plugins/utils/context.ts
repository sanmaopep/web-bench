import path from 'path'
import fs from 'promise-fs'
import { IProjectRunner } from '@web-bench/evaluator-types'
import { getFileContent } from '../../utils/file-content'

export class ContextGetter {
  public project: IProjectRunner

  public constructor(project: IProjectRunner) {
    this.project = project
  }

  public async getTaskContext(): Promise<Record<string, string>> {
    const {
      project: {
        ignore,
        settings: { outputProjectDir, files },
      },
    } = this
    const res: Record<string, string> = {}

    const sourcePath = outputProjectDir[0]

    const ig = await ignore.getIgnore()

    for (const filePath of files) {
      if (ig.ignores(filePath)) {
        continue
      }

      const fullPath = path.join(sourcePath, filePath)

      const content = await getFileContent(fullPath)

      res[filePath] = content
    }

    return res
  }
}
