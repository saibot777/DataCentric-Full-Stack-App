import { DataFieldComponent } from './shared/data-field.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
import { NamingConvention } from 'breeze-client';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ZzaRepositoryService } from './shared/zzarepository.service';
import { CustomersListComponent } from './customers/customers-list.component';
import { CustomersListItemComponent } from './customers/customers-list-item/customers-list-item.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { OrderItemsConcatProductsPipe  } from './shared/order-items-concat-products.pipe';
import { InitGuard } from './shared/init-guard';
import { OrderComponent } from './orders/order/order.component';
import { ProductListComponent } from './orders/product-list/product-list.component';
import { CanDeactivateGuard } from './shared/can-deactivate-guard';

@NgModule({
  declarations: [
    AppComponent,
    CustomersListComponent,
    CustomersListItemComponent,
    CustomerDetailComponent,
    OrderItemsConcatProductsPipe,
    OrderComponent,
    ProductListComponent,
    DataFieldComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BreezeBridgeAngularModule,
    AppRoutingModule,
    ModalModule.forRoot(),
  ],
  providers: [
    ZzaRepositoryService,
    InitGuard,
    CanDeactivateGuard
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    NamingConvention.camelCase.setAsDefault();
  }
 }
