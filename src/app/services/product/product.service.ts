import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { StockAdded } from 'src/app/models/stockAdded';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductsByBranchId(id: string) {
    return this.http.get<Product[]>('http://localhost:8081/api/products/' + id);
  }

  addProductToBranch(product: Product) {
    return this.http.post<Product>(
      'http://localhost:8080/api/v1/product/register',
      product
    );
  }

  addStockToProduct(stock:StockAdded) {
    return this.http.patch<StockAdded>(
      'http://localhost:8080/api/v1/product/purchase',
      stock
    );
  }

  makeOrderForCustomer(newOrder:Order){
    return this.http.patch<Order>(
      'http://localhost:8080/api/v1/product/customer-sale',
      newOrder
    );
  }

  makeOrderForReseller(newOrder:Order){
    return this.http.patch<Order>(
      'http://localhost:8080/api/v1/product/reseller-sale',
      newOrder
    );
  }
}
