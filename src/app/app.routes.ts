import { Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail';
import { Login } from './login/login';

export const routes: Routes = [

  // Page principale
  {
    path: '',
    component: AssignmentsComponent
  },

  // Page login
  {
    path: 'login',
    component: Login
  },

  // Page détail assignment
  {
    path: 'detail/:id',
    component: AssignmentDetailComponent
  },

  // Redirection si route inconnue
  {
    path: '**',
    redirectTo: ''
  }

];