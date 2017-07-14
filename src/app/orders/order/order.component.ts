import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderItem, Customer, Product } from '../../model/entity-model';
import { ZzaRepositoryService } from '../../shared/zzarepository.service';
import { CanComponentDeactivate } from '../../shared/can-deactivate-guard';

@Component({
  selector: 'zza-order',
  templateUrl: 'order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, CanComponentDeactivate {
  constructor(private _zzaRepository: ZzaRepositoryService,
    private _route: ActivatedRoute,
    private _router: Router)
  { }

  private _order: Order = null;
  private _customerId = '';

  private orderItems: OrderItem[] = [];

  private pizzas: Product[] = [];
  private salads: Product[] = [];
  private drinks: Product[] = [];

  private selectedTab: string = "pizzas";
  private _orderedStatusId: number;

  ngOnInit() {
    this._customerId = this._route.snapshot.params['customerId'];
    if (!this._customerId) {
      this._router.navigate(['']);
    }
    else {
      let orderStatuses = this._zzaRepository.getOrderStatuses();
      orderStatuses.forEach(os => { if (os.name == "Ordered") this._orderedStatusId = os.id; });
      this._zzaRepository.getProducts().then(products => {
        products.forEach(product => {
          switch (product.type) {
            case 'pizza':
              this.pizzas.push(product);
              break;
            case 'salad':
              this.salads.push(product);
              break;
            case 'drink':
              this.drinks.push(product);
              break;
            default:
              break;
          }
        });
      });
    }
  }

  canDeactivate() : boolean {
    this.cancelOrder();
    return true;
  }

  addToOrder(itemInfo: any) {
    if (!this._order) {
      this._order = <Order>this._zzaRepository.createEntity("Order");
      this._order.customerId = this._customerId;
      this._order.orderStatusId = this._orderedStatusId;
      this._order.orderDate = new Date();
    }
    var orderItem = <OrderItem>this._zzaRepository.createEntity("OrderItem");
    orderItem.orderId = this._order.id;
    orderItem.product = itemInfo.product;
    orderItem.size = itemInfo.size;
    // orderItem.productId = itemInfo.product.id;
    // orderItem.productSizeId = itemInfo.size.id;
    this._order.items.push(orderItem);
    this.orderItems.push(orderItem);
  }

  submitOrder() {
    if (this._order == null) return;
    this._zzaRepository.submitOrder(this._order).then(_ => {
      this._order = null;
      this.orderItems = [];
      alert("Order placed!");
      this._router.navigate(['/']);
    }, function (error) {
      alert("Error saving order: " + error.message);
    });
  }

  cancelOrder() {
    if (this._order == null) return;
    let entityManager = this._order.entityAspect.entityManager;
    console.log(entityManager.getChanges());
    this._order.entityAspect.rejectChanges();
    this.orderItems.forEach(oi => oi.entityAspect.rejectChanges());
    //entityManager.rejectChanges();
    console.log(entityManager.getChanges());
  }
}
