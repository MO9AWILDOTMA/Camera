import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthModule } from './auth/auth.module';
import { AdminGuard } from '../core/guards/admin.guard';
import { ClientGuard } from '../core/guards/client.guard';
import { GuestGuard } from '../core/guards/guest.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
    canActivate: [ClientGuard]
  },
  {
    path: "auth",
    component: AuthComponent,
    canActivate: [GuestGuard]
  },
  {
    path: '',
    loadChildren: () => import('./guest/guest.module').then(m => m.GuestModule),
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthModule,
    RouterModule.forChild(routes)
  ]
})
export class PagesModule { }
