import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from 'src/app/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  api_storage: string = `http://${window._env.STORAGE_URI}`;

  constructor(private http:HttpClient) { }

  getInvoicesByBranch(branchId:string){
    return this.http.get<Invoice[]>(`${this.api_storage}/api/v1/invoice/`+branchId);
  }

}
