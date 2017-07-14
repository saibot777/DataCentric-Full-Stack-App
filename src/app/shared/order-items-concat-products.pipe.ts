import { Pipe, PipeTransform } from '@angular/core';

import { OrderItem, Product } from '../model/entity-model';
@Pipe({
    name: 'orderitemsconcatproducts'
})

export class OrderItemsConcatProductsPipe implements PipeTransform {
    transform(value: any, args: any[]): any {
        let orderItems = value as OrderItem[];
        let result = "";
        if (orderItems){
            let first: boolean = true;
            orderItems.forEach(oi =>{
                if (!first) result += ", ";
                first = false;
                result += oi.product.name;
            });
        }
        return result;
    }
}
