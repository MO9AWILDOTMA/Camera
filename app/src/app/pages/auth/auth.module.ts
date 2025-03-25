import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthModule as AuthComponentModule } from '../../core/components/auth/auth.module';


@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthComponentModule
  ],
})
export class AuthModule { }
