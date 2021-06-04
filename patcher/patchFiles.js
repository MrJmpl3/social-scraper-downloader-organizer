const fs = require('fs')
const { resolve } = require('path')

fs.copyFile(
  resolve(__dirname, '..','patcher', 'patchs', 'entry.js'),
  resolve(
    __dirname,
    '..',
    'node_modules',
    'tiktok-scraper',
    'build',
    'entry.js'
  ),
  (err) => {
    if (err) throw err
  }
)
