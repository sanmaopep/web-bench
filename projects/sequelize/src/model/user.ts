import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/libs/db'

export const  generateReferralCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 定义 User 模型
export class User extends Model {
  public id!: number
  public username!: string
  public password!: string
  public role!: string
  public coin!: number
  public referralCode!: string
  public referredBy!: string | null
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
    referralCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'username'
      }
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
)

// 初始化用户数据
export const initUsers = async () => {
  const count = await User.count()
  if (count === 0) {
    await User.bulkCreate([
      { 
        username: 'admin', 
        password: '123456', 
        role: 'admin', 
        coin: 0,
        referralCode: generateReferralCode()
      },
      { 
        username: 'user', 
        password: '123456',

        role: 'user', 
        coin: 1000,
        referralCode: generateReferralCode()
      },
    ])
  }
}