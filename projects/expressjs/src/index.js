// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
