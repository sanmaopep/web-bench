import fs from 'node:fs'
import path from 'node:path'

const VIRTUAL_MODULE_ID = '~files'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export default function virtualFiles() {
  return {
    name: 'virtual-files',
    
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const filesDir = path.resolve(process.cwd(), 'src/files')
        
        // 确保目录存在
        if (!fs.existsSync(filesDir)) {
          return 'export default {}'
        }

        const files = fs.readdirSync(filesDir)
        const imports = []
        const exports = []

        files.forEach((file, index) => {
          if (file.endsWith('.ts') || file.endsWith('.js')) {
            const absFilePath = path.join(filesDir, file)
            const name = path.basename(file, path.extname(file))
            imports.push(`import * as file${index} from '${absFilePath}'`)
            exports.push(`  ${name}: file${index}`)
          }
        })

        return `${imports.join('\n')}\n\nexport default {\n${exports.join(',\n')}\n}`
      }
    }
  }
} 