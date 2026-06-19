import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function cmsPlugin() {
  return {
    name: 'cms-api',
    configureServer(server) {
      server.middlewares.use('/api/content', (req, res) => {
        const file = path.resolve('src/content.json')
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.end(fs.readFileSync(file, 'utf-8'))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => (body += chunk))
          req.on('end', () => {
            fs.writeFileSync(file, body)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          })
        } else {
          res.statusCode = 405
          res.end()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), cmsPlugin()],
})
