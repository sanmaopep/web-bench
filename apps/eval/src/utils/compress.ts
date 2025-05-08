import fs from 'fs'
import archiver from 'archiver'
import path from 'path'

export function compressFolder(folderPath: string) {
  return new Promise((resolve, reject) => {
    // 检查文件夹是否存在
    if (!fs.existsSync(folderPath)) {
      return reject(new Error(`文件夹 ${folderPath} 不存在`))
    }

    // 获取文件夹名称，用于生成压缩文件名称
    const folderName = path.basename(folderPath)
    const outputPath = path.join(path.dirname(folderPath), `${folderName}.zip`)

    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip')

    archive.pipe(output)

    function addFolderToArchive(folderPath: string, base: string) {
      const files = fs.readdirSync(folderPath)
      files.forEach((file) => {
        const filePath = path.join(folderPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          addFolderToArchive(filePath, base)
        } else {
          const relativePath = path.relative(base, filePath)
          archive.file(filePath, { name: relativePath })
        }
      })
    }

    addFolderToArchive(folderPath, folderPath)

    archive.on('error', (err) => {
      reject(err)
    })

    output.on('close', () => {
      resolve(outputPath)
    })

    archive.finalize()
  })
}
