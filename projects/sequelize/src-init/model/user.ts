import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'

// Define User model
export class User extends Model {
  public id!: number
  public username!: string
  public password!: string
  public role!: string
  public coin!: number
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
)

// Initialize user data
export const initUsers = async () => {
  const count = await User.count()
  if (count === 0) {
    await User.bulkCreate([
      { username: 'admin', password: '123456', role: 'admin', coin: 0 },
      { username: 'user', password: '123456', role: 'user', coin: 1000 },
    ])
  }
}
