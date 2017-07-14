import { MetadataStore } from 'breeze-client';

import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';
import { OrderItemOption } from './order-item-option';
import { ProductOption } from './product-option';
import { Product } from './product';
import { ProductSize } from './product-size';
import { OrderStatus } from './order-status';

export class RegistrationHelper {

    static register(metadataStore: MetadataStore) {
        metadataStore.registerEntityTypeCtor('Customer', Customer);
        metadataStore.registerEntityTypeCtor('Order', Order);
        metadataStore.registerEntityTypeCtor('OrderItem', OrderItem);
        metadataStore.registerEntityTypeCtor('OrderItemOption', OrderItemOption);
        metadataStore.registerEntityTypeCtor('ProductOption', ProductOption);
        metadataStore.registerEntityTypeCtor('Product', Product);
        metadataStore.registerEntityTypeCtor('ProductSize', ProductSize);
        metadataStore.registerEntityTypeCtor('OrderStatus', OrderStatus);
    }
}
