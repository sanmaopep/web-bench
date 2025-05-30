// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

// Define User model
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

// Initialize user data
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