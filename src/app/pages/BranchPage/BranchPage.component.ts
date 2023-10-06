import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Invoice } from 'src/app/models/invoice';
import { Product } from 'src/app/models/product';
import { StockAdded } from 'src/app/models/stockAdded';
import { InvoiceService } from 'src/app/services/invoices/invoice.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-BranchPage',
  templateUrl: './BranchPage.component.html',
  styleUrls: ['./BranchPage.component.css'],
})
export class BranchPageComponent implements OnInit {

  productsInBranch: Product[] = [];
  invoicesInBranch: Invoice[] = [];

  socket?: WebSocketSubject<Product>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.getInvoices();
    this.getProducts();
  }


  getProducts() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.productService.getProductsByBranchId(id!).subscribe((data) => {
      this.productsInBranch = data;
      this.connectToChannel(id!);
    });
  }

  getInvoices() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.invoiceService.getInvoicesByBranch(id!).subscribe((data) => {
      this.invoicesInBranch = data;
      console.log(data);
    });
  }


  connectToChannel(path: string) {
    this.socket = this.socketService.connetToSpecificSpace(path);
    this.socket.subscribe((message) => this.updateView(message));
  }

  updateView(message: any) {
    if (message?.type.includes('ProductAdded')) {
      this.addProductView(message);
    } else if (message?.type.includes('StockAdded')) {
      this.stockAddedView(message);
    } else if (message?.type.includes('SaleRegistered')) {
      this.reduceStockView(message);
      this.addInvoiceView(message);

    }
  }

  addProductView(newProduct: Product) {
    this.productsInBranch?.unshift(newProduct);
  }

  stockAddedView(message:StockAdded) {
    this.productsInBranch?.forEach((product) => {
      if (product.id === message.productId) {
        product.inventoryStock += message.quantityToAdd;
      }
    });
  }

  reduceStockView(message:Invoice) {
    this.productsInBranch?.forEach((product) => {
      message.products.forEach((productInvoice) => {
        if (product.id === productInvoice.id) {
          product.inventoryStock -= productInvoice.quantity;
        }
      });
    });
  }

  addInvoiceView(message:Invoice) {
    message.date = new Date(Date.now());
    this.invoicesInBranch?.unshift(message);
  }
}
