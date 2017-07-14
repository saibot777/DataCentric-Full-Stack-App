import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ZzaRepositoryService } from '../../shared/zzarepository.service';
import { Product, ProductSize } from '../../model/entity-model';

@Component({
  selector: 'zza-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private selectedProduct: Product;

  constructor(private _zzaRepository: ZzaRepositoryService) { }
  private productSizes: ProductSize[];
  private selectedProductSizeId: number = -1;

  @Input()
  products: Product[];
  @Input()
  productType: string;

  @Output()
  addProduct: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.productSizes = this._zzaRepository.getProductSizes(this.productType);
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  addToOrder() {
    let size = this.productSizes.find(ps => ps.id === this.selectedProductSizeId);
    this.selectedProductSizeId = -1;
    this.addProduct.emit({ product: this.selectedProduct, size: size });
  }

}
