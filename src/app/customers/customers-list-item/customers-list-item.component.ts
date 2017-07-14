import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';

import { Customer } from '../../model/entity-model';
import { ZzaRepositoryService } from '../../shared/zzarepository.service';

@Component({
  selector: 'zza-customers-list-item',
  templateUrl: './customers-list-item.component.html',
  styleUrls: ['./customers-list-item.component.css']
})
export class CustomersListItemComponent implements OnInit {
  private isSelected: boolean;

  constructor(private _zzaRepository: ZzaRepositoryService) { }

  @ViewChild('deleteModal')
  public deleteModal: ModalDirective;

  @Input()
  public customer: Customer;

  @Input()
  public set selectedCustomer(value: Customer) {
    if (value === this.customer) {
      this.isSelected = true;
    }
    else {
      this.isSelected = false;
    }
  }

  @Output()
  deleted = new EventEmitter<void>();

  ngOnInit() {
  }

  deleteCustomer() {
    this.deleteModal.show();
  }
    confirmDeleteCustomer() {
        this.deleteModal.hide();
        this._zzaRepository.deleteCustomer(this.customer).then(_  =>
          this._zzaRepository.saveChanges()).then(_  =>
            this.deleted.emit(),  error =>  console.error(error));
    }
}
