import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningModule } from './warning/warning.module';
import { RouterModule, Routes } from '@angular/router';
import { WarningComponent } from './warning/warning.component';
import { AuthComponent } from './auth/auth.component';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: "",
    component: WarningComponent
  },
  {
    path: "auth",
    component: AuthComponent
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WarningModule,
    AuthModule,
    RouterModule.forChild(routes)
  ]
})
export class PagesModule { }
