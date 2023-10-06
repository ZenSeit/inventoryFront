import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from 'src/app/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http:HttpClient) { }

  getInvoicesByBranch(branchId:string){
    return this.http.get<Invoice[]>("http://localhost:8081/api/v1/invoice/"+branchId);
  }

}
