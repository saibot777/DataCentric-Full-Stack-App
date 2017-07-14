import { Component, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ZzaRepositoryService } from '../shared/zzarepository.service';
import { Customer } from '../model/entity-model';

@Component({
  selector: 'zza-customers-list',
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {
  private selectedCustomer: Customer;
  private searchField: string = 'name';
  private searchInput: string;
  private currentPage: number = 1;
  private pageCount: number;
  private _totalRecords: number;
  private _pageSize: number = 5;


  constructor(private _zzaRepository: ZzaRepositoryService,
    private elementRef: ElementRef) {
    const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .map(() => this.searchInput)
      .debounceTime(500)
      .distinctUntilChanged();
    eventStream.subscribe(input => this.search(input));
  }

  customers: Customer[];

  ngOnInit() {
    this.refresh(1);
  }

  pageUp() {
    if (this.currentPage * this._pageSize >= this._totalRecords) return;
    let newPage = this.currentPage + 1;
    this.refresh(newPage);

  }

  pageDown() {
    if (this.currentPage == 1) return;
    let  newPage = this.currentPage - 1;
    this.refresh(newPage);
  }

  refresh(page: number = 1) {
    this.searchInput = "";
    this._zzaRepository.getCustomers(page, this._pageSize).then(result => {
      this.customers = result.customers;
      this._totalRecords = result.totalRecords;
      this.pageCount = Math.floor(this._totalRecords / this._pageSize);
      if (this.pageCount < (this._totalRecords / this._pageSize)) this.pageCount += 1;
      this.currentPage = page;
    },
      error => console.error(error));
  }

  save() {
    this._zzaRepository.saveChanges().then(() => {
      this.ngOnInit();
    }, error => console.error(error));
  }

  onSelect(customer: Customer) {
    this.selectedCustomer = customer;
  }

  search(value) {
    this._zzaRepository.searchAsync(value, this.searchField).then(customers => {
      this.customers = customers;
    })
  }

}
