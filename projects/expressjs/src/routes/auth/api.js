const express = require('express')
const router = express.Router()
const db = require('../../libs/db')
const { generateReferralCode, checkReferrerExists, creditReferrer } = require('./referer')
const { generateToken, verifyToken } = require('../../libs/auth')

router.post('/api/auth', (req, res) => {
  const { username, password } = req.body

  db.get(
    'SELECT username, role FROM users WHERE username = ? AND password = ?',
    [username, password],
    async (err, user) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }
      if (!user) {
        res.status(401).json({ success: false })
        return
      }

      const token = await generateToken({
        username: user.username,
        role: user.role,
      })

      res.cookie('TOKEN', token, { httpOnly: true })
      res.json({ success: true })
    }
  )
})

router.get('/api/auth', async (req, res) => {
  const token = req.cookies.TOKEN
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { username } = payload

  db.get('SELECT username, role, coin FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message })
      return
    }
    if (!user) {
      res.status(401).json({ success: false })
      return
    }

    res.json({
      username: user.username,
      role: user.role,
      coin: user.coin,
    })
  })
})

router.post('/api/register', async (req, res) => {
  const { username, password, coins, referralCode } = req.body

  try {
    // First check if username already exists
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT username FROM users WHERE username = ?', [username], (err, user) => {
        if (err) reject(err)
        else resolve(user)
      })
    })

    if (user) {
      // Username already exists
      res.status(409).json({ success: false, message: 'Username already exists' })
      return
    }

    if (referralCode) {
      const refererExists = await checkReferrerExists(referralCode)

      if (!refererExists) {
        res.status(409).json({ success: false, message: 'Invalid referral code' })
      }
    }

    const newReferralCode = generateReferralCode()

    // Username is available, create new user
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password, role, coin, referral_code, referrer_referral_code) VALUES (?, ?, ?, ?, ?, ?)',
        [username, password, 'user', coins, newReferralCode, referralCode],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    if (referralCode) {
      await creditReferrer(referralCode, 888)
    }

    // Generate token for the new user
    const token = await generateToken({
      username: username,
      role: 'user',
    })

    // Set the token in cookie
    res.cookie('TOKEN', token, { httpOnly: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/profile/:username', async (req, res) => {
  const token = req.cookies.TOKEN
  const payload = await verifyToken(token)

  if (!payload?.username) {
    return res.redirect('/login')
  }

  const { username, role } = payload

  const isCurrent = username === req.params.username

  if (!isCurrent && role !== 'admin') {
    return res.redirect('/login')
  }

  // 找当前用户的信息
  db.get(
    'SELECT username, coin, referral_code FROM users WHERE username = ?',
    [req.params.username],
    (err, user) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message })
        return
      }
      if (!user) {
        res.status(401).json({ success: false })
        return
      }

      res.render('profile', { user, isCurrent })
    }
  )
})

router.post('/api/auth/logout', async (req, res) => {
  res.clearCookie('TOKEN')
  res.status(200).json({ success: true })
})

router.post('/api/recharge', async (req, res) => {
  const token = req.cookies.TOKEN
  const payload = await verifyToken(token)
  if (!payload?.username) {
    return res.redirect('/login')
  }
  const { username } = payload

  db.run('UPDATE users SET coin = coin + 1000 WHERE username = ?', [username], function (err) {
    if (err) {
      res.status(500).json({ success: false, error: err.message })
      return
    } else {
      res.status(200).json({ success: true })
    }
  })
})

module.exports = router
