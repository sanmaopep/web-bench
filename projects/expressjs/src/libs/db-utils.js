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

const sqlite3 = require('sqlite3')

// Helper function to run multiple async functions in a transaction
const runTransaction = async (sqlList) => {
  const connection = new sqlite3.Database(process.env.DB_HOST)

  // Promisify the run method for transaction control
  const runAsync = (sql, params, afterCb) => {
    return new Promise((resolve, reject) => {
      connection.run(sql, params, function (err) {
        if (err) reject(err)
        else {
          afterCb?.(this.lastID)
          resolve()
        }
      })
    })
  }

  try {
    await runAsync('BEGIN TRANSACTION')

    // Execute all callbacks sequentially
    for (const sql of sqlList) {
      if (typeof sql === 'function') {
        const dynamicSql = sql()
        await runAsync(dynamicSql.sql, dynamicSql.deps, dynamicSql.afterCb)
        continue
      }
      await runAsync(sql.sql, sql.deps, sql.afterCb)
    }

    await runAsync('COMMIT')
  } catch (error) {
    await runAsync('ROLLBACK')
    throw error
  } finally {
    connection.close()
  }
}

module.exports = {
  runTransaction,
}
