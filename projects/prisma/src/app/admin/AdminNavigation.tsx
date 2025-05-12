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

'use client'

import Link from 'next/link'
import './admin-navigation.css'

export default function AdminNavigation() {
  return (
    <div className="admin-navigation">
      <Link href="/admin/products" className="admin-nav-link">
        Products Management
      </Link>
      <Link href="/admin/users" className="admin-nav-link">
        Users Management
      </Link>
      <Link href="/admin/orders" className="admin-nav-link">
        Orders Management
      </Link>
    </div>
  )
}