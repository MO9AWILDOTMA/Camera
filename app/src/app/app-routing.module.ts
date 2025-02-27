import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarningComponent } from './pages/warning/warning.component';

const routes: Routes = [
  {
    path: "",
    component: WarningComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
