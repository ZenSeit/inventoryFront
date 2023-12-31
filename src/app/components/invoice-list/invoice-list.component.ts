import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'src/app/models/invoice';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  @Input() invoices:Invoice[] = [];
  selectedInvoiceIndex: number = -1;

  constructor() { }

  ngOnInit() {
  }

  onRowClick(index: number) {
    this.selectedInvoiceIndex = index;
  }

}
