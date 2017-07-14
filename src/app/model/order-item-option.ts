import { EntityBase } from './entity-base';
import { OrderItem } from './order-item';
import { ProductOption } from './product-option';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class OrderItemOption extends EntityBase {

   /// <code> Place custom code between <code> tags
   
   /// </code>

   // Generated code. Do not place code below this line.
   id: number;
   storeId: string;
   orderItemId: number;
   productOptionId: number;
   quantity: number;
   price: number;
   orderItem: OrderItem;
   productOption: ProductOption;
}

