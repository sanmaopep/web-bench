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

const path = require('path')
const sqlite3 = require('sqlite3')
const fs = require('fs')

const PROJECT_DIR = process.argv[2] || 'src'

const DB_FILE_NAME = process.env.DB_HOST || 'test.sqlite'

console.log('Sqlite File Name:', path.join(process.cwd(), DB_FILE_NAME))
// if db file exists, delete it
if (fs.existsSync(DB_FILE_NAME)) {
  console.log('Sqlite File Exists, remove it:', DB_FILE_NAME)
  fs.rmSync(DB_FILE_NAME)
}

// if sql file not exists, exit
const setupSqlFilePath = path.join(PROJECT_DIR, 'libs/setup.sql')
if (!fs.existsSync(setupSqlFilePath)) {
  console.log('setup.sql not exists in:', setupSqlFilePath)
  process.exit()
}

const setupSql = fs.readFileSync(setupSqlFilePath, 'utf8')

const db = new sqlite3.Database(DB_FILE_NAME)

db.serialize(() => {
  setupSql
    .split(';')
    .map((sql) => sql.trim())
    .filter((sql) => sql.length > 0)
    .forEach((sql) => {
      console.log('\nExecuting SQL:\n', sql)

      db.run(sql, (err) => {
        if (err) {
          console.error('Error executing SQL:', sql)
          console.error('Error details:', err)
        }
      })
    })
})

db.close()
