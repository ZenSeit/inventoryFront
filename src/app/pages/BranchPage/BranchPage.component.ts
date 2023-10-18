import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Branch } from 'src/app/models/branch';
import { Invoice } from 'src/app/models/invoice';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { ProductSale } from 'src/app/models/productSale';
import { ProductToAdd } from 'src/app/models/productToAdd';
import { StockAdded } from 'src/app/models/stockAdded';
import { User } from 'src/app/models/user';
import { BranchesService } from 'src/app/services/branches/branches.service';
import { InvoiceService } from 'src/app/services/invoices/invoice.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-BranchPage',
  templateUrl: './BranchPage.component.html',
  styleUrls: ['./BranchPage.component.css'],
})
export class BranchPageComponent implements OnInit {
  productsInBranch: Product[] = [];
  productsWithStock: Product[] = [];
  invoicesInBranch: Invoice[] = [];
  usersInBranch: User[] = [];
  branch: Branch | undefined;
  productForm!: FormGroup;
  productoSeleccionado: Product | undefined;
  productosSeleccionados: ProductSale[] = [];
  orderForm!: FormGroup;
  reportForm!: FormGroup;
  orderType: string = 'customer';
  roleUser: string = '';
  inventoryExcel: any;
  emailCustomer: string = '';

  socket?: WebSocketSubject<Product>;

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchesService,
    private productService: ProductService,
    private userService: UserService,
    private invoiceService: InvoiceService,
    private socketService: SocketService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private authJwt: JwtHelperService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getInvoices();
    this.getProducts();
    this.getBranch();
    this.getRole();
    this.getUser();

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

    this.reportForm = this.formBuilder.group({
      category: [''],
      filterCategory: [false],
      stockLessThan: [''],
      filterStock: [false],
      priceLessThan: [''],
      filterPrice: [false],
      sellType: [''],
      filterOrder: [false],
      totalOrder: [''],
      filterTotalOrder: [false],

    });
  }

  getProducts() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.productService.getProductsByBranchId(id!).subscribe(
      (data) => {
        this.productsInBranch = data;
        this.filterProducstWithStock();
        this.connectToChannel(id!);
      },
      (error) => {
        this.toastr.error('Error connecting with inventory', 'Error');
      }
    );
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

  getUser() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.userService.getUsersByBranch(id!).subscribe((data) => {
      this.usersInBranch = data;
    });
  }

  createProduct(newProduct: Product) {
    this.productService.addProductToBranch(newProduct).subscribe((data) => {
      this.toastr.success(
        `Product ${newProduct.name} created successfully`,
        'Success'
      );
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

  addProductView(newProduct: any) {
    const product: Product = {
      id: newProduct.productId,
      name: newProduct.name,
      description: newProduct.description,
      inventoryStock: newProduct.inventoryStock || 0,
      price: newProduct.price,
      category: newProduct.category,
      branchId: newProduct.aggregateRootId,
    };
    this.productsInBranch?.unshift(product);
  }

  stockAddedView(message: StockAdded) {
    console.log(message);
    console.log(this.productsInBranch);

    message.products.forEach((product) => {
      this.productsInBranch?.forEach((productInBranch) => {
        if (product.productId === productInBranch.id) {
          productInBranch.inventoryStock += product.quantity;
          this.filterProducstWithStock();
        }
      });
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

  onTypeEmailChange(value: any) {
    this.emailCustomer = value || '';
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

    let messageForEmail = `<h3>Products:</h3> <br>
    <ul>
    ${this.productosSeleccionados.map((product) => {
      return `<li>${product.name} - ${product.quantity}</li>`;
    })}
    </ul>
    `;

    console.log(this.emailCustomer);
    console.log(messageForEmail);

    if (this.orderType === 'customer') {
      this.productService.makeOrderForCustomer(newOrder).subscribe((data) => {
        this.productosSeleccionados = [];
        this.filterProducstWithStock();
        this.toastr.success(
          'Final customer order created successfully',
          'Success'
        );
        this.invoiceService.sendEmail(this.emailCustomer, messageForEmail);
      });
    } else {
      this.productService.makeOrderForReseller(newOrder).subscribe((data) => {
        this.productosSeleccionados = [];
        this.filterProducstWithStock();
        this.toastr.success('Reseller order created successfully', 'Success');
        this.invoiceService.sendEmail(this.emailCustomer, messageForEmail);
      });
    }
  }

  getRole() {
    this.tokenService.setToken();
    this.tokenService.token$.subscribe((data) => {
      if (data) {
        this.roleUser = this.authJwt.decodeToken(data).roles;
      }
    });
  }

  readInventoryExcel(event: any) {
    const file = event.target.files[0];

    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      let dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

      this.inventoryExcel = dataExcel;
    };
  }

  sendExcel() {
    const branchId: string | null = this.route.snapshot.paramMap.get('id');
    const stock: StockAdded = {
      branchId: branchId || '',
      products: this.inventoryExcel,
    };

    this.productService.addStockToProduct(stock).subscribe(
      (data) => {
        this.toastr.success('Stock added successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Error adding stock', 'Error');
      }
    );
  }

  generateReport(filters: any) {
    let productosFiltrados = this.productsInBranch;
    let invoicesFiltradas = this.invoicesInBranch;

    if (filters.filterCategory) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.category === filters.category
      );
    }

    if (filters.filterPrice) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.price <= filters.priceLessThan
      );
    }

    if (filters.filterStock) {
      productosFiltrados = productosFiltrados.filter(
        (producto) => producto.inventoryStock <= filters.stockLessThan
      );
    }

    if(filters.filterOrder){
      invoicesFiltradas = invoicesFiltradas.filter(
        (invoice) => invoice.sellType.toLowerCase().includes(filters.sellType)
      );
    }

    if(filters.filterTotalOrder){
      invoicesFiltradas = invoicesFiltradas.filter(
        (invoice) => invoice.total <= filters.totalOrder
      );
    }

    const doc = new jsPDF(
      {
        orientation: 'l',
        unit: 'mm',
        format: 'letter',
       }
    );

    let bodyTable = productosFiltrados.map(producto =>{
      return [producto.id || '', producto.name, producto.description, producto.inventoryStock.toString(), producto.price.toString(), producto.category]
    });

    
    doc.text(`Informe sucursal ${this.branch?.name} - ${this.branch?.location}`, 10, 10);


    autoTable(doc,{
      startY: 30,
      head: [['id', 'name', 'description', 'inventoryStock', 'price', 'category']],
      body: [...bodyTable],
    })


    bodyTable = invoicesFiltradas.map(invoice =>{
      return [invoice.sellType, invoice.total.toString(), invoice.date.toString()]
    }
    );


    autoTable(doc,{
      head: [['Tipo de venta', 'total', 'date']],
      body: [...bodyTable],
    })


    doc.save('report.pdf');
  }
}
