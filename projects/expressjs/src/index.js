const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(require('./routes/products/api'))
app.use(require('./routes/auth/api'))
app.use(require('./routes/home/api'))
app.use('/admin', require('./routes/admin/api'))
app.use(require('./routes/wishlist/api'))
app.use(require('./routes/cart/api'))
app.use(require('./routes/order/api'))
app.use(require('./routes/pay/api'))
app.use(require('./routes/refund/api'))
app.use(require('./routes/comment/api'))

app.use((req, res) => {
  res.status(404).render('error')
})

app.listen(process.env.PORT, () => {
  console.log(`App listening: http://localhost:${process.env.PORT}`)
})
