import { PagesModule } from './pages/pages.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarningComponent } from './pages/warning/warning.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./pages/pages.module").then(m => m.PagesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
