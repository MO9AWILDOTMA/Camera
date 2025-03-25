import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthModule } from './components/auth/auth.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthModule
  ]
})
export class CoreModule { }
