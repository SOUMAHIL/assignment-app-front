import { Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail';
import { Login } from './login/login';

export const routes: Routes = [

  // Redirige vers login par défaut
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Page login
  {
    path: 'login',
    component: Login
  },

  // Dashboard
  {
    path: 'dashboard',
    component: AssignmentsComponent
  },

  // Page détail assignment
  {
    path: 'detail/:id',
    component: AssignmentDetailComponent
  },

  // Redirection si route inconnue
  {
    path: '**',
    redirectTo: 'login'
  }

];