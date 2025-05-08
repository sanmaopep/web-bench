const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../libs/auth')

router.get('/', async (req, res) => {
  const token = req.cookies.TOKEN
  const payload = await verifyToken(token)

  res.render('home', { username: payload?.username, role: payload?.role })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router
