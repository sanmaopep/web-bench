import { Routes } from '@angular/router'
import { BlogPageComponent } from './pages/blogPage/blogPage.component'
import { GameComponent } from './pages/game/game.component'

export const routes: Routes = [
  { path: '', component: BlogPageComponent },
  { path: 'game', component: GameComponent }
]