import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

constructor(private http:HttpClient) { }

getProductsByBranchId(id:string){
  return this.http.get<Product[]>("http://localhost:8081/api/products/"+id);
}

}
