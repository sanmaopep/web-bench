import fs from 'node:fs'

export default function mock() {
  const mockData = JSON.parse(fs.readFileSync('mock.json', 'utf-8'))
  
  return {
    name: 'vite-plugin-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const mockKey = `${req.method.toLowerCase()} ${req.url}`
        
        if (mockData[mockKey]) {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(mockData[mockKey]))
          return
        }
        
        next()
      })
    }
  }
} 