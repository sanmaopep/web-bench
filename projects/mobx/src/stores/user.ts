import { makeAutoObservable, runInAction } from 'mobx'

class UserStore {
  username = ''
  isLoggedIn = false

  constructor() {
    makeAutoObservable(this)
  }


  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        runInAction(() => {
          this.username = username
          this.isLoggedIn = true
        })
        
        // Save login status
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  logout() {
    this.username = ''
    this.isLoggedIn = false
  }
}

const userStore = new UserStore()
export default userStore