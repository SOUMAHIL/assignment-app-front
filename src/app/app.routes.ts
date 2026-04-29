import { Routes } from '@angular/router';

import { AssignmentsComponent } from './assignments/assignments';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail';

export const routes: Routes = [

  // Page principale
  {
    path: '',
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
    redirectTo: ''
  }

];