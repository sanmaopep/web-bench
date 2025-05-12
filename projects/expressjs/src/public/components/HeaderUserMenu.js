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

class HeaderUserMenu extends HTMLElement {
  constructor() {
    super()
    this.render().then(() => {
      this.addEventListeners()
    })
  }

  username

  async checkLoginStatus() {
    const res = await fetch('/api/auth')
    const data = await res.json()

    this.username = data.username

    return data
  }

  async render() {
    await this.checkLoginStatus()

    this.innerHTML = `
      <style>
        .container {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .header-go-login {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .header-go-login:hover {
          background: #45a049;
        }

        .header-username {
          color: #333;
          font-size: 14px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          position: relative;
        }

        .header-username:hover {
          background: #f5f5f5;
        }

        .dropdown {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 4px;
          min-width: 150px;
          z-index: 1000;
        }

        .header-username:hover .dropdown {
          display: block;
        }

        .dropdown button {
          display: block;
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown button:hover {
          background: #f5f5f5;
        }

        .header-logout-btn {
          color: #f44336;
        }

        .header-go-user-profile {
          color: #2196F3;
        }
        
        .header-go-to-my-orders {
          color: #673AB7;
        }
      </style>

      ${
        this.username
          ? `
        <div class="container">
          <div class="header-username">
            ${this.username}
            <div class="dropdown">
              <button class="header-go-user-profile">Profile</button>
              <button class="header-go-to-my-orders">My Orders</button>
              <button class="header-logout-btn">Logout</button>
            </div>
          </div>
        </div>
      `
          : `
        <div class="container">
          <button class="header-go-login">Login</button>
        </div>
      `
      }
    `
  }

  addEventListeners() {
    this.addEventListener('click', async (e) => {
      if (e.target.matches('.header-go-login')) {
        window.location.href = '/login'
      }

      if (e.target.matches('.header-logout-btn')) {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
        })
        if (res.ok) {
          window.location.href = '/'
        }
      }

      if (e.target.matches('.header-go-user-profile')) {
        window.location.href = `/profile/${this.username}`
      }

      if (e.target.matches('.header-go-to-my-orders')) {
        window.location.href = '/my-orders'
      }
    })
  }
}

customElements.define('header-user-menu', HeaderUserMenu)
