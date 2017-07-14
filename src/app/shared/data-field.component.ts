import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'zza-data-field',
  templateUrl: 'data-field.component.html'
})

export class DataFieldComponent {
  @Input() propName: string;
  @Input() propLabel: string;
  @Input() entity;

  get dataProp() {
    return this.entity && this.propName ? this.entity[this.propName] : '';
  }
  set dataProp(value: any) {
    if (this.entity && this.propName && this.entity.entityAspect) {
      this.entity.entityAspect.clearValidationErrors();
      this.entity[this.propName] = value;
    }
  }

  getValidationErrors() {
    if (!this.entity || !this.entity.entityAspect || !this.propName) { return null; }
    this.entity.entityAspect.validateProperty(this.propName);
    const errors = this.entity.entityAspect.getValidationErrors(this.propName);
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

