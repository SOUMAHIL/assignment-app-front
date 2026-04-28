import { Routes } from '@angular/router';

import { Assignments } from './assignments/assignments';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail';

export const routes: Routes = [

  // Page principale
  {
    path: '',
    component: Assignments
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