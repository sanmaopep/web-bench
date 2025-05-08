import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'

export class Product extends Model {
  public id!: number
  public name!: string
  public price!: number
  public image!: string
  public description!: string
  public quantity!: number
}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  }
)