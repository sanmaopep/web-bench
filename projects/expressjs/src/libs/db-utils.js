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
