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

import { writable } from 'svelte/store';
import App from './App.svelte';
import Game from './pages/Game.svelte';

export const currentPath = writable(window.location.pathname);

window.addEventListener('popstate', () => {
  currentPath.set(window.location.pathname);
});

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  currentPath.set(path);
}

export function getComponent(path: string) {
  switch(path) {
    case '/game':
      return Game;
    default:
      return App;
  }
}