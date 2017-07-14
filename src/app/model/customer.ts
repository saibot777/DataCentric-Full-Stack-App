import { EntityBase } from './entity-base';
import { Order } from './order';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Customer extends EntityBase {

   /// <code> Place custom code between <code> tags
   
   /// </code>

   // Generated code. Do not place code below this line.
   id: string;
   storeId: string;
   firstName: string;
   lastName: string;
   phone: string;
   email: string;
   street: string;
   city: string;
   state: string;
   zip: string;
   age: number;
   orders: Order[];
}

