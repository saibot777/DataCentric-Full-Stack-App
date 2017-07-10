import {Injectable} from '@angular/core';
import { Customer } from "app/model/customer";

@Injectable()
export class CentricCoreService {

    constructor() {}

    getCustomers() : Promise<Customer[]> {
        let promise = new Promise<Customer[]>((resolve, reject) => {
            let customers = this.getCustomerDummyData();
            resolve(customers);
        });
        return promise;
    }

    private getCustomerDummyData(): Customer[] {
        let cust1 = new Customer();
        cust1.firstName = "Fred";
        cust1.lastName  = "Flinstone";
        let cust2 = new Customer();
        cust2.firstName = "Burney";
        cust2.lastName  = "Rumble";
        let customers : Customer[] = [cust1, cust2];
        return customers;
    }
}