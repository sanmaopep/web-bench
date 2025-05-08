import sqlite3 from 'sqlite3'

const db = new sqlite3.Database(process.env.DB_HOST!)

export type TransactionSQL = {
  // Only support INSERT, UPDATE, DELETE
  sql: string
  deps: any[]
  afterCb?: (lastID: number) => void
}

export type DynamicTransactionSQL = () => TransactionSQL

// Helper function to run multiple async functions in a transaction
export const runTransaction = async (
  sqlList: (TransactionSQL | DynamicTransactionSQL)[]
): Promise<void> => {
  const connection = new sqlite3.Database(process.env.DB_HOST!)

  // Promisify the run method for transaction control
  const runAsync = (
    sql: string,
    params: any[] = [],
    afterCb?: (lastID: number) => void
  ): Promise<void> => {
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

export default db
