import { atom } from 'jotai';
import { routeAtom, navigateAtom } from './route';

export interface User {
  username: string;
  isLoggedIn: boolean;
}

export const userAtom = atom<User>({
  username: '',
  isLoggedIn: false
});

export const loginAtom = atom(
  null,
  async (get, set, credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (data.success) {
        set(userAtom, {
          username: credentials.username,
          isLoggedIn: true
        });
        
        set(navigateAtom, '/');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }
);

export const logoutAtom = atom(
  null,
  (get, set) => {
    set(userAtom, {
      username: '',
      isLoggedIn: false
    });
    
    const navigate = get(navigateAtom);
    navigate('/login');
  }
);