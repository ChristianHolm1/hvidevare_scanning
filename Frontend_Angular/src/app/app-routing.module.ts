import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductContainerComponent } from './product-container/product-container.component';

const routes: Routes = [
  {
    path: 'frontpage',
    component: FrontpageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'stores/:id',
    component: ProductContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
