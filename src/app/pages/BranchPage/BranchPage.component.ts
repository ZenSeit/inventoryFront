import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Branch } from 'src/app/models/branch';
import { Invoice } from 'src/app/models/invoice';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { ProductSale } from 'src/app/models/productSale';
import { StockAdded } from 'src/app/models/stockAdded';
import { BranchesService } from 'src/app/services/branches/branches.service';
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
  productsWithStock: Product[] = [];
  invoicesInBranch: Invoice[] = [];
  branch: Branch | undefined;
  productForm!: FormGroup;
  productoSeleccionado: Product | undefined;
  productosSeleccionados: ProductSale[] = [];
  orderForm!: FormGroup;
  orderType: string = 'customer';

  socket?: WebSocketSubject<Product>;

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchesService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private socketService: SocketService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getInvoices();
    this.getProducts();
    this.getBranch();

    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category: [''],
      branchId: [this.route.snapshot.paramMap.get('id')],
    });

    this.orderForm = this.formBuilder.group({
      product: [''],
      quantity: [''],
    });
  }

  getProducts() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.productService.getProductsByBranchId(id!).subscribe((data) => {
      this.productsInBranch = data;
      this.filterProducstWithStock();
      this.connectToChannel(id!);
    });
  }

  getInvoices() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.invoiceService.getInvoicesByBranch(id!).subscribe((data) => {
      this.invoicesInBranch = data;
    });
  }

  getBranch() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.branchService.getBranchById(id!).subscribe((data) => {
      this.branch = data;
      if (!data) this.router.navigate(['/']);
    });
  }

  createProduct(newProduct: Product) {
    this.productService.addProductToBranch(newProduct).subscribe((data) => {
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

  stockAddedView(message: StockAdded) {
    this.productsInBranch?.forEach((product) => {
      if (product.id === message.productId) {
        product.inventoryStock += message.quantityToAdd;
        this.filterProducstWithStock();
      }
    });
  }

  reduceStockView(message: Invoice) {
    this.productsInBranch?.forEach((product) => {
      message.products.forEach((productInvoice) => {
        if (product.id === productInvoice.id) {
          product.inventoryStock -= productInvoice.quantity;
          this.filterProducstWithStock();
        }
      });
    });
  }

  addInvoiceView(message: Invoice) {
    message.date = new Date(Date.now());
    this.invoicesInBranch?.unshift(message);
  }

  selectProductForCar(product: Product) {
    this.productoSeleccionado = product;
  }

  addProductToCar(value: any) {
    const productSale: ProductSale = {
      id: value.product.id,
      name: value.product.name,
      quantity: value.quantity,
    };

    const existingProductIndex = this.productosSeleccionados.findIndex(
      (product) => product.id === productSale.id
    );

    if (existingProductIndex !== -1) {
      this.productosSeleccionados[existingProductIndex].quantity +=
        productSale.quantity;
    } else {
      this.productosSeleccionados.push(productSale);
    }
  }

  deleteProductCart(id: string) {
    this.productosSeleccionados = this.productosSeleccionados.filter(
      (product) => product.id !== id
    );
  }

  onTypeOrderChange(value: any) {
    this.orderType = value || 'customer';
  }

  filterProducstWithStock() {
    this.productsWithStock = this.productsInBranch.filter(
      (product) => product.inventoryStock > 0
    );
  }

  createOrder() {
    if (
      this.productosSeleccionados.length === 0 ||
      this.route.snapshot.paramMap.get('id') == undefined
    )
      return;

    const newOrder: Order = {
      branchId: this.route.snapshot.paramMap.get('id') || '',
      products: this.productosSeleccionados,
    };

    if (this.orderType === 'customer') {
      this.productService.makeOrderForCustomer(newOrder).subscribe((data) => {
        this.productosSeleccionados = [];
        this.filterProducstWithStock();
      });
    } else {
      this.productService.makeOrderForReseller(newOrder).subscribe((data) => {
        this.productosSeleccionados = [];
        this.filterProducstWithStock();
      });
    }
  }
}
