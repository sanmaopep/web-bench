class HeaderUserMenu extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.userInfo = null
  }

  async connectedCallback() {
    this.render()
    await this.checkAuthStatus()
  }

  async checkAuthStatus() {
    try {
      const response = await fetch('/api/simple_auth')
      if (response.ok) {
        this.userInfo = await response.json()
        this.render()
      } else {
        this.userInfo = null
        this.render()
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
      this.userInfo = null
      this.render()
    }
  }

  async logout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      })
      if (response.ok) {
        this.userInfo = null
        this.render()
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .header-user-container {
          position: relative;
          display: inline-block;
        }
        
        .header-go-login {
          background-color: white;
          color: #4a89dc;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .header-go-login:hover {
          background-color: #f0f0f0;
        }
        
        .header-username {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        
        .header-username:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .username-icon {
          margin-right: 8px;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          min-width: 180px;
          z-index: 1000;
          display: none;
        }
        
        .header-user-container:hover .dropdown-menu {
          display: block;
        }
        
        .dropdown-item {
          padding: 10px 16px;
          color: #333;
          display: block;
          text-decoration: none;
          transition: background-color 0.3s;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
      </style>
      
      <div class="header-user-container">
        ${
          this.userInfo
            ? `
            <div class="header-username">
              <span class="username-icon">👤</span> ${this.userInfo.username}
            </div>
            <div class="dropdown-menu">
              <a class="dropdown-item header-go-user-profile" href="/profile/${this.userInfo.username}">
                My Profile
              </a>
              <a class="dropdown-item header-go-to-my-orders" href="/orders">
                My Orders
              </a>
              <div class="dropdown-item header-logout-btn" id="logoutButton">
                Logout
              </div>
            </div>
          `
            : `
            <button class="header-go-login" id="loginButton">
              Login
            </button>
          `
        }
      </div>
    `

    if (!this.userInfo) {
      this.shadowRoot.querySelector('#loginButton').addEventListener('click', () => {
        window.location.href = '/login'
      })
    } else {
      this.shadowRoot.querySelector('#logoutButton').addEventListener('click', () => {
        this.logout()
      })
    }
  }
}

customElements.define('header-user-menu', HeaderUserMenu)
