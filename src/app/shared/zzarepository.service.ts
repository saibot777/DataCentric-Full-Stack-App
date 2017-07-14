import { InitialNavigation } from '@angular/router/src/router_module';
import { Injectable } from '@angular/core';

import {
  EntityManager, EntityQuery, Entity, Predicate, Validator,
  FilterQueryOp, FetchStrategy, FetchStrategySymbol, EntityState, core
} from 'breeze-client';

import { Customer, Order, OrderStatus, Product, ProductSize } from '../model/entity-model';
import { RegistrationHelper } from '../model/registration-helper';

@Injectable()
export class ZzaRepositoryService {
  // private _em: EntityManager = new EntityManager("http://localhost:2113/breeze/zza");
  private _em: EntityManager = new EntityManager("http://zzaapi.azurewebsites.net/breeze/zza");
  private _customersCached: boolean = false;
  private _initialized: boolean;

  constructor() {
    RegistrationHelper.register(this._em.metadataStore);
    this._em.entityChanged.subscribe(args => {
      // console.log(`${args.entity.entityType.name} ${args.entityAction.toString()}`);
      let changes = this._em.getChanges();
      let chStr = this._em.exportEntities(changes);
      localStorage['changeCache'] = chStr;
    });
  }

  initialize() {
    let promise = new Promise<boolean>((resolve, reject) => {
      if (this._initialized) resolve(true);
      else {
        this._initialized = true;
        let existingChanges = localStorage['changeCache'];
        if (existingChanges) {
          localStorage.removeItem('changeCache');
          this._em.importEntities(existingChanges);
        }
        this._em.executeQuery(EntityQuery.from('Lookups')).then(lookupsResponse => {
          this.initValidation();
          resolve(true);
        }, error => console.error(error));
      }
    });
    return promise;
  }

  private initValidation() {
    const meta = this._em.metadataStore;
    const custType = <any>meta.getEntityType('Customer');
    const ageProp = custType.getProperty('age');
    const phoneProp = custType.getProperty('phone');
    const emailProp = custType.getProperty('email');

    emailProp.validators.push(Validator.emailAddress());

    //phoneProp.validators.push(Validator.phone());

    phoneProp.validators.push(Validator.makeRegExpValidator(
      'phoneValidator',
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      '%displayName% \' %value% \' - phone numbers should be US formatted 10 digit phone number'));

    const customAgeValidator = new Validator('ageValidator', this.ageValidator,
      { messageTemplate: '%displayName% must be 18 to 120, current value %value%, its %day%' });
    ageProp.validators.push(customAgeValidator);
  }

  private ageValidator(value, context) {
    context.day = 'Tuesday';
    return value >= 18 && value <= 120;
  }

  getOrderStatuses(): OrderStatus[] {
    return this._em.executeQueryLocally(EntityQuery.from("OrderStatuses")) as OrderStatus[];
  }
  getProductSizes(productType: string): ProductSize[] {
    return this._em.executeQueryLocally(EntityQuery.from("ProductSizes").where("type", "equals", productType)) as ProductSize[];
  }

  getProducts(): Promise<Product[]> {
    let promise = new Promise<Product[]>((resolve, reject) => {
      let query = EntityQuery.from("Products");
      let products = this._em.executeQueryLocally(query) as Product[];
      if (products && products.length > 0) {
        resolve(products);
        return;
      }
      this._em.executeQuery(query).then(response => {
        resolve(response.results as Product[]);
      }, error => reject(error));
    });
    return promise;
  }

  getCustomers(page: number, pageSize: number): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let query = EntityQuery.from("Customers")
        .orderBy(["state", "lastName"])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .inlineCount();
      this._em.executeQuery(query).then(queryResult => {
        this._customersCached = true;
        resolve({ customers: queryResult.results, totalRecords: queryResult.inlineCount });
      },
        error => reject(error));
    });
    return promise;
  }

  getCustomerSummaries(): Promise<Customer[]> {
    let promise = new Promise((resolve, reject) => {
      let query = EntityQuery.from("Customers")
        .select(["firstName", "lastName", "email", "phone", "state"]);
      this._em.executeQuery(query).then(queryResult => resolve(<any>queryResult.results),
        error => reject(error));
    });
    return promise;
  }

  getCustomer(id: string): Promise<Customer> {
    let promise = new Promise((resolve, reject) => {
      let query = EntityQuery.from('Customers').where('id', 'equals', id);
      let strategy: FetchStrategySymbol;
      if (!this._customersCached) {
        strategy = FetchStrategy.FromServer;
      }
      else {
        strategy = FetchStrategy.FromLocalCache;
      }
      this._em.executeQuery(query.using(strategy)).then(response => {
        if (response.results && response.results.length == 1)
          resolve(response.results[0]);
        else
          resolve(null);
      }, error => reject(error));
    });
    return promise;
  }

  getCustomerById(id: string) {
    return this._em.getEntityByKey('Customer', id);
  }

  getCustomersWithChanges() {
    return <Customer[]>this._em.getEntities('Customers', [EntityState.Added, EntityState.Modified, EntityState.Deleted]);
  }

  getCustomerOrderHistory(customerId: string): Promise<Order[]> {
    let promise = new Promise((resolve, reject) => {
      let query = EntityQuery.from('Orders')
        .where('customerId', FilterQueryOp.Equals, customerId)
        .expand(['items', 'items.product', 'items.options']);
      this._em.executeQuery(query).then(queryResult => {
        resolve(queryResult.results);
      }, error => reject(error));
    });
    return promise;
  }

  createEntity(typeName: string): Entity {
    let options: any = {};
    if (typeName === 'Customer') {
      options.id = core.getUuid();
      // console.log(options.id);
    }
    return this._em.createEntity(typeName, options);
  }

  deleteCustomer(customer: Customer): Promise<void> {
    return this.getCustomerOrderHistory(customer.id).then(orders => {
      orders.slice().forEach(o => {
        o.items.slice().forEach(oi => {
          oi.options.slice().forEach(opt => opt.entityAspect.setDeleted());
          oi.entityAspect.setDeleted();
        });
        o.entityAspect.setDeleted();
      });
      customer.entityAspect.setDeleted();
    });
  }

  saveChanges() {
    let promise = new Promise((resolve, reject) => {
      this._em.saveChanges().then(() => resolve(),
        error => reject(error));
    });
    return promise;
  }

  search(searchTerm: string, field: string) {
    let pred: Predicate;
    if (field === 'name') {
      pred = new Predicate('firstName', FilterQueryOp.Contains, searchTerm)
        .or(new Predicate('lastName', FilterQueryOp.Contains, searchTerm));
    }
    else pred = new Predicate(field, FilterQueryOp.Contains, searchTerm);
    let query = EntityQuery.from('Customers').where(pred);
    return this._em.executeQueryLocally(query);
  }

  searchAsync(searchTerm: string, field: string): Promise<Customer[]> {
    let promise = new Promise((resolve, reject) => {
      let pred: Predicate;
      if (field === 'name') {
        pred = new Predicate('firstName', FilterQueryOp.Contains, searchTerm)
          .or(new Predicate('lastName', FilterQueryOp.Contains, searchTerm));
      }
      else pred = new Predicate(field, FilterQueryOp.Contains, searchTerm);
      let query = EntityQuery.from('Customers').where(pred);
      this._em.executeQuery(query)
        .then(queryResult => resolve(queryResult.results),
        error => reject(error));
    });
    return promise;
  }

  submitOrder(order: Order): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let items: Array<any> = [order];
      order.items.forEach(oi => items.push(oi));
      this._em.saveChanges(items).then(_ => resolve(), error => console.error(error));
    });
    return promise;
  }
}
