import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'
import { Order } from './order'
import { Product } from './product'

export class OrderItem extends Model {
  public id!: number
  public orderId!: number
  public productId!: number
  public quantity!: number
  public price!: number
}

OrderItem.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'orderItems',
    timestamps: true
  }
)

// Set up associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' })
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });