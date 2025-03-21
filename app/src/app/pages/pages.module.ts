import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningModule } from './warning/warning.module';
import { RouterModule, Routes } from '@angular/router';
import { WarningComponent } from './warning/warning.component';

const routes: Routes = [
  {
    path: "",
    component: WarningComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WarningModule,
    RouterModule.forChild(routes)
  ]
})
export class PagesModule { }
