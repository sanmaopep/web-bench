const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.listen(process.env.PORT, () => {
  console.log(`App listening: http://localhost:${process.env.PORT}`)
})
