import { Middleware } from 'redux';
import { setRoute } from '../models/route';

export const routeMiddleware: Middleware = store => {
  // Listen for popstate events (back/forward buttons)
  window.addEventListener('popstate', () => {
    store.dispatch(setRoute(window.location.pathname));
  });

  return next => action => {
    return next(action);
  };
};

// Helper function to navigate
export const navigate = (path: string) => {
  window.history.pushState(null, '', path);
  return setRoute(path);
};