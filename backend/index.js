const express = require('express')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const colors = require('colors')
const pool = require('./config/db')
const errorHandler = require('./middleware/error')

// Load .env
const dotenvConf = dotenv.config({ path: './backend/config/.env' })
if (dotenvConf.error) throw dotenvConf.error

const PORT = process.env.PORT || 5005

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan(process.env.NODE_ENV === 'dev' ? 'dev' : 'common'))

// Mount API routes
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/posts', require('./routes/posts'))
app.use('/api/v1/feed', require('./routes/feed'))
app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/comments', require('./routes/comments'))
app.use('/api/v1/followrequests', require('./routes/followRequests'))

//
// Front-end
//
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

// Error handler
app.use(errorHandler)

// Start server
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server and exit process
  server.close(() => process.exit(1))
})
