import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import  {  InitGuard  }  from  './shared/init-guard';
import { CanDeactivateGuard } from './shared/can-deactivate-guard';

import { CustomersListComponent } from './customers/customers-list.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { OrderComponent } from './orders/order/order.component';

const routes: Routes = [
  {
      path:  '',  canActivateChild: [InitGuard],  children:  [
      { path: '', component: CustomersListComponent },
      { path: 'customer-list', component: CustomersListComponent },
      { path: 'customer-detail/:customerId', component: CustomerDetailComponent },
      { path: 'customer-add', component: CustomerDetailComponent },
      { path: 'order/:customerId', component: OrderComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
