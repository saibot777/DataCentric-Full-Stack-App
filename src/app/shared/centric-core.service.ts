import {Injectable} from '@angular/core';
import { Customer } from "app/model/customer";
import { EntityManager, EntityQuery } from "breeze-client";

@Injectable()
export class CentricCoreService {
    private _em : EntityManager = new EntityManager("http://zzaapi.azurewebsites.net/breeze/zza");

    constructor() {}

    getCustomers() : Promise<Customer[]> {
        let promise = new Promise<Customer[]>((resolve, reject) => {
            let query = EntityQuery.from("Customers");
            this._em.executeQuery(query).then(queryResult => resolve(<any>queryResult.results),
                                              error => reject(error));
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