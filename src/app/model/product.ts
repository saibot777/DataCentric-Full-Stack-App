import { EntityBase } from './entity-base';

/// <code-import> Place custom imports between <code-import> tags

/// </code-import>

export class Product extends EntityBase {

   /// <code> Place custom code between <code> tags
   
   /// </code>

   // Generated code. Do not place code below this line.
   id: number;
   type: string;
   name: string;
   description: string;
   image: string;
   hasOptions: boolean;
   isVegetarian: boolean;
   withTomatoSauce: boolean;
   sizeIds: string;
}

