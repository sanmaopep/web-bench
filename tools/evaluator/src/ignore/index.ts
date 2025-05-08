import { ProjectRunner } from '../runner'
import ignore, { Ignore } from 'ignore'
import path from 'path'
import fs from 'promise-fs'

export class IgnoreGetter {
  public project: ProjectRunner

  protected _ignore: Ignore

  public constructor(project: ProjectRunner) {
    this.project = project
  }

  public async getIgnore(): Promise<Ignore> {
    // Cache to prevent repeatedly reading ignore files
    if (this._ignore) {
      return this._ignore
    }

    const {
      project: {
        settings: { projectDir, repositoryDir },
      },
    } = this

    const ig = ignore()

    const addIgnoreFile = async (ignoreFilePath: string) => {
      if (fs.existsSync(ignoreFilePath)) {
        const ignoreFile = await fs.readFile(ignoreFilePath, { encoding: 'utf-8' })
        ig.add(ignoreFile)
      }
    }
    await addIgnoreFile(path.join(projectDir, '.gitignore'))
    await addIgnoreFile(path.join(projectDir, '.npmignore'))
    await addIgnoreFile(path.join(repositoryDir, '.gitignore'))
    await addIgnoreFile(path.join(projectDir, '.evalignore'))

    this._ignore = ig

    return this._ignore
  }
}
