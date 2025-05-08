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