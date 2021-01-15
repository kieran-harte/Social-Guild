const express = require('express')
const path = require('path')
const fs = require('fs')

const PORT = process.env.PORT || 5005

const app = express()

const appDir = path.join(__dirname, '..', 'dist', 'app', 'app.html')
const returnPage = (req, res) => {
  res.sendFile(appDir)
}

// read routes from views.json file
const dirs = fs.readFileSync(
  path.join(__dirname, '..', 'frontend', 'app', 'routes.json'),
  'utf8'
)
const PAGE_URLS = Object.keys(JSON.parse(dirs))
app.get(PAGE_URLS, returnPage)

// Set static folder
app.use(express.static(path.join(__dirname, '..', 'dist')))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
