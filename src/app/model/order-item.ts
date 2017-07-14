import { EntityBase } from './entity-base';
import { Order } from './order';
import { OrderItemOption } from './order-item-option';
import { Product } from './product';
import { ProductSize } from './product-size';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class OrderItem extends EntityBase {

   /// <code> Place custom code between <code> tags
   
   /// </code>

   // Generated code. Do not place code below this line.
   id: number;
   storeId: string;
   orderId: number;
   productId: number;
   productSizeId: number;
   quantity: number;
   unitPrice: number;
   totalPrice: number;
   instructions: string;
   options: OrderItemOption[];
   order: Order;
   product: Product;
   size: ProductSize;
}

