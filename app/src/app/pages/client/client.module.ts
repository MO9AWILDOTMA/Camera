import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayoutComponent } from './layout/client-layout.component';
import { ClientGuard } from '../../core/guards/client.guard';
import { ClientDashboardComponent } from './client-dashboard/cleint-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [ClientGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: ClientDashboardComponent
      },
      // Add other client routes here
    ]
  }
];

@NgModule({
  declarations: [
    ClientLayoutComponent,
    ClientDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientModule { }
