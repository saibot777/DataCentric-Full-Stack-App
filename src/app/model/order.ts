import { EntityBase } from './entity-base';
import { Customer } from './customer';
import { OrderItem } from './order-item';
import { OrderStatus } from './order-status';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Order extends EntityBase {

   /// <code> Place custom code between <code> tags
   
   /// </code>

   // Generated code. Do not place code below this line.
   id: number;
   storeId: string;
   customerId: string;
   orderStatusId: number;
   orderDate: Date;
   deliveryDate: Date;
   deliveryCharge: number;
   itemsTotal: number;
   phone: string;
   deliveryStreet: string;
   deliveryCity: string;
   deliveryState: string;
   deliveryZip: string;
   customer: Customer;
   items: OrderItem[];
   status: OrderStatus;
}

