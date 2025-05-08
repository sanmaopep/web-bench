import path from 'path'
import fs, { stat } from 'promise-fs'
import { fileValidate } from '../../parser'
import ignore from 'ignore'
import { IProjectRunner } from '@web-bench/evaluator-types'

export class Writer {
  public project: IProjectRunner

  public constructor(project: IProjectRunner) {
    this.project = project
  }

  public async writeFiles(originFiles: Record<string, string>) {
    //
    const files: Record<string, string> = {}

    const { outputProjectDir, fileValidate: fileValidateConfig = {} } = this.project.settings

    const ig = ignore().add(fileValidateConfig.exclude || [])

    const sourcePath = outputProjectDir[0]

    for (const [filename, content] of Object.entries(originFiles)) {
      if (filename) {
        files[path.join(sourcePath, filename)] = content
      }
    }

    this.project.logger.debug('files', Object.keys(files), Object.keys(originFiles))

    /**
     * 将返回的结果修改到具体文件
     */

    for (const [filename, content] of Object.entries(files)) {
      // 文件夹不存在时，创建文件夹
      const fileDir = path.dirname(filename)

      try {
        await fs.stat(fileDir)
      } catch (error) {
        this.project.logger.debug('Create Directory: ', fileDir)

        this.project.logger.debug('fileDir', fileDir, filename)

        await fs.mkdir(fileDir, {
          recursive: true,
        })
      }

      const validateRes = ig.ignores(path.relative(sourcePath, filename))
        ? ''
        : fileValidate(filename, content)

      if (validateRes) {
        throw Error(validateRes)
      }

      this.project.logger.debug('Writing file: ', filename)

      // 需要验证新增文件这样会不会报错
      if (content.trim()) {
        await fs.writeFile(filename, content, {
          encoding: 'utf-8',
        })
        this.project.logger.debug('Writing file - end: ', filename)
      } else {
        try {
          // 当这个文件存在的话不进行操作
          await stat(filename)
          this.project.logger.debug('Writing file-  end: content is empty.')
        } catch (error) {
          await fs.writeFile(filename, content, {
            encoding: 'utf-8',
          })
          // 当这个文件不存在的话需要创建文件，其他文件会引用该文件，不写入会导致 build 时报错
          this.project.logger.debug('Writing file-  end: create empty file')
        }
      }
    }
  }
}
