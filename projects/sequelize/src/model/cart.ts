import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'
import { User } from './user'
import { Product } from './product'

export class Cart extends Model {
  public id!: number
  public username!: string
  public productId!: number
  public quantity!: number
  public product!: Product
}

Cart.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username'
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
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username', 'productId']
      }
    ]
  }
)

// Set up associations
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' })