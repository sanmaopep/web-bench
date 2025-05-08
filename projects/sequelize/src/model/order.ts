import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'
import { User } from './user'

export class Order extends Model {
  public id!: number
  public username!: string
  public totalPrice!: number
  public status!: string
}

Order.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username'
      }
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending payment'
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true
  }
)

// Set up associations
Order.belongsTo(User, { foreignKey: 'username' })