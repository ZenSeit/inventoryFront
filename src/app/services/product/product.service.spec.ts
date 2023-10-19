import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from 'src/app/models/product';
import { StockAdded } from 'src/app/models/stockAdded';
import { Order } from 'src/app/models/order';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products by branch ID', () => {
    const mockProducts: Product[] = [];

    const branchId = 'branchId';
    service.getProductsByBranchId(branchId).subscribe((products: Product[]) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(
      `${service.api_storage}/api/products/${branchId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add product to branch', () => {
    const mockProduct: Product = {
      id: 'productId',
      name: 'productName',
      description: 'productDescription',
      inventoryStock: 0,
      price: 100,
      category: 'productCategory',
      branchId: 'branchId',
    };

    service.addProductToBranch(mockProduct).subscribe((product: Product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/product/register`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should add stock to product', () => {
    const mockStock: StockAdded = {
      branchId: 'branchId',
      products: [],
    };

    service.addStockToProduct(mockStock).subscribe((stock: StockAdded) => {
      expect(stock).toEqual(mockStock);
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/product/purchase`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush(mockStock);
  });

  it('should make order for customer', () => {
    const mockOrder: Order = {
      products: [],
      branchId: 'branchId',
    };

    service.makeOrderForCustomer(mockOrder).subscribe((order: Order) => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/product/customer-sale`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush(mockOrder);
  });

  it('should make order for reseller', () => {
    const mockOrder: Order = {
      products: [],
      branchId: 'branchId',
    };

    service.makeOrderForReseller(mockOrder).subscribe((order: Order) => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/product/reseller-sale`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush(mockOrder);
  });
});
