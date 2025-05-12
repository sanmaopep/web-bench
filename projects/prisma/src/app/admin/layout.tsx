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

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import AdminNavigation from './AdminNavigation'
import './admin.css'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.username || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="admin-layout">
      <h1 className="admin-title">Admin Portal</h1>
      <AdminNavigation />
      {children}
    </div>
  )
}