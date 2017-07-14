import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer, Order } from '../../model/entity-model';
import { ZzaRepositoryService } from '../../shared/zzarepository.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  private customer: Customer = new Customer();
  private errorMessage: string;
  private isEditMode: boolean;

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _zzaRepository: ZzaRepositoryService) { }
  @ViewChild('theForm') currentForm: NgForm;
  orders: Order[];

  ngOnInit() {
    if (this._route.routeConfig.path !== "customer-add") { // edit customer
      this.isEditMode = true;
      let id = this._route.snapshot.params['customerId'];
      this._zzaRepository.getCustomer(id).then(customer => {
        this.customer = customer;
        this.customer.entityAspect.propertyChanged.subscribe(args => {
          //console.log(`${args.propertyName}: was ${args.oldValue}, now ${args.newValue}`);
        });
        this._zzaRepository.getCustomerOrderHistory(id).then(orders => this.orders = orders);
      }, error => {
        this.errorMessage = error.message;
      });
    }
    else { // add customer
      this.customer = <Customer>this._zzaRepository.createEntity("Customer");
    }
  }

  onSave() {
    if (this.currentForm.invalid) return;
    this._zzaRepository.saveChanges().then(() => {
      this._router.navigate(['customer-list']);
    }, error => {
      if (!error.entityErrors && error.message) {
        this.errorMessage = error.message;
      }
    });
  }

  getValidationErrors(propertyName) {
    if (!this.customer || !this.customer.entityAspect) { return; }
    this.customer.entityAspect.validateProperty(propertyName);
    const errors = this.customer.entityAspect.getValidationErrors(propertyName);
    if (errors && errors.length > 0) {
      let error = '';
      errors.forEach(e => {
        if (error.trim()) { error += ', '; }
        error += e.errorMessage;
      });
      return error;
    } else { return null; }
  }


}
