import { CentricCoreService } from './../shared/centric-core.service';
import { Customer } from './../model/customer';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'customers-list',
    templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {
    customers : Customer[];

    constructor(private _centricService : CentricCoreService) {}

    ngOnInit() {
        this._centricService.getCustomers().then(customers => this.customers = customers,
                                                    error => console.error(error));
    }
    
}