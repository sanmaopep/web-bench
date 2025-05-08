import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'
import { User } from './user'
import { Product } from './product'

export class Comment extends Model {
  public id!: number
  public username!: string
  public productId!: number
  public rating!: number
  public comment!: string
}

Comment.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
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
Comment.belongsTo(User, { foreignKey: 'username' })
Comment.belongsTo(Product, { foreignKey: 'productId' })