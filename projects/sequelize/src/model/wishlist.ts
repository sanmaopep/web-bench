import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'
import { User } from './user'
import { Product } from './product'

export class Wishlist extends Model {
  public id!: number
  public username!: string
  public productId!: number
  public product!: Product
}

Wishlist.init(
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
    }
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
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
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' })