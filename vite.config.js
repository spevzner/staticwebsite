import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import heicConvert from 'heic-convert'

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

      server.middlewares.use('/api/upload', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        const url = new URL(req.url, 'http://localhost')
        const original = url.searchParams.get('filename') || 'upload'
        let ext = path.extname(original).slice(0, 10)
        const safeBase = path.basename(original, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60) || 'image'
        const uploadsDir = path.resolve('public/uploads')
        fs.mkdirSync(uploadsDir, { recursive: true })
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', async () => {
          let buffer = Buffer.concat(chunks)
          if (/\.hei[cf]$/i.test(ext)) {
            try {
              buffer = Buffer.from(await heicConvert({ buffer, format: 'JPEG', quality: 0.9 }))
              ext = '.jpg'
            } catch {
              res.statusCode = 422
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Could not convert HEIC image' }))
              return
            }
          }
          const filename = `${Date.now()}-${safeBase}${ext}`
          fs.writeFileSync(path.join(uploadsDir, filename), buffer)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ url: `/uploads/${filename}` }))
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), cmsPlugin()],
  server: {
    allowedHosts: ['new-host-5', 'new-host-5.home'],
  },
})
