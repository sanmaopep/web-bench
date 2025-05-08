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
