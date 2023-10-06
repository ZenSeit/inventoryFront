import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { StockAdded } from 'src/app/models/stockAdded';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input() productsInBranch: Product[] = [];
  ProductSelected: Product | undefined;
  productForm!: FormGroup;
  orderForm!: FormGroup;
  productOrder: Product | undefined;

  constructor(private formBuilder:FormBuilder,private productService:ProductService) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.orderForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      typeOrder: ['', [Validators.required]]
    });
  }

  selectProduct(product: Product) {
    this.ProductSelected = product;
  }

  orderProduct(product: Product) {
    this.productOrder = product;
  }



  onSubmit(quantity: any) {
    let addStock: StockAdded = {
      branchId: this.ProductSelected!.branchId || '',
      productId: this.ProductSelected!.id || '',
      quantityToAdd: quantity.quantity,
    };
    this.productService.addStockToProduct(addStock).subscribe((data) => {
      this.ProductSelected = undefined;
    });
    
  }

  makeOrder(order:any){
    let newOrder: Order = {
      branchId: this.productOrder!.branchId || '',
      products: [{
        id: this.productOrder!.id || '',
        name: this.productOrder!.name || '',
        quantity: order.quantity
      }]
    };

    if(order.typeOrder === 'customer'){
      this.productService.makeOrderForCustomer(newOrder).subscribe((data) => {
        this.productOrder = undefined;
      });
    }else{
      this.productService.makeOrderForReseller(newOrder).subscribe((data) => {
        this.productOrder = undefined;
      });
    }
  }

}
