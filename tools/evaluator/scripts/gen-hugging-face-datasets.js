const { parse } = require('yaml')
const path = require('path')
const fs = require('promise-fs')
const fse = require('fs-extra')
const dayjs = require('dayjs')

;(async () => {
  const projectRoot = path.join(__dirname, '../../../projects/')

  const allProjects = await fs.readdir(projectRoot)

  const projectStats = await Promise.all(
    allProjects.map((p) => {
      return fs.stat(path.join(projectRoot, p))
    })
  )

  const projects = allProjects.filter((_, i) => projectStats[i].isDirectory())

  const results = []

  for (const project of projects) {
    const projectDir = path.join(projectRoot, project)

    if (!(await fse.pathExists(path.join(projectDir, 'package.json')))) {
      continue
    }
    const packageJsonStr = await fs.readFile(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8',
    })

    const packageJson = packageJsonStr ? JSON.parse(packageJsonStr) : {}

    if (packageJson?.eval?.stable) {
      let baseTasks = []

      if (await fse.pathExists(path.join(projectDir, 'tasks.yml'))) {
        const ymlContent = await fs.readFile(path.join(projectDir, 'tasks.yml'), {
          encoding: 'utf8',
        })
        baseTasks = parse(ymlContent)
      } else if (await fse.pathExists(path.join(projectDir, 'tasks.jsonl'))) {
        const lines = (
          await fs.readFile(path.join(projectDir, 'tasks.jsonl'), {
            encoding: 'utf8',
          })
        ).split('\n')
        baseTasks = lines.map((line) => JSON.parse(line))
      } else {
        throw new Error(`No tasks found for project ${projectDir}`)
      }
      results.push({
        project,
        prompt_list: baseTasks.filter((t) => t.id !== 'init'),
      })
    }
  }

  const hash = dayjs().format('YYYYMMDD-HHmmss')


  try {
    fs.mkdirSync(path.join(__dirname, '..', 'datasets'))
  } catch (error) {}

  try {
    fs.mkdirSync(path.join(__dirname, '..', 'datasets', `datasets-${hash}`))
  } catch (error) {}

  results.forEach((r) => {
    fs.writeFileSync(
      path.join(
        __dirname,
        '..',
        'datasets',
        `datasets-${hash}`,
        r.project + '.jsonl'
      ),
      r.prompt_list.map((t) => JSON.stringify(t)).join('\n'),
      {
        encoding: 'utf-8',
      }
    )
  })
})()
