import { CustomersListComponent } from './customers/customers-list.component';
import { CentricCoreService } from './shared/centric-core.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomersListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CentricCoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
