import { Sequelize, Transaction } from 'sequelize'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_HOST,
  transactionType: Transaction.TYPES.IMMEDIATE,
})
