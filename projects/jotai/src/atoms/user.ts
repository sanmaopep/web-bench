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