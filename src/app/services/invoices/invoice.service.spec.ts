import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvoiceService } from './invoice.service';
import { Invoice } from 'src/app/models/invoice';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvoiceService],
    });
    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch invoices by branch ID', () => {
    const mockInvoices: Invoice[] = [
    ];

    const branchId = 'branchId';
    service.getInvoicesByBranch(branchId).subscribe((invoices: Invoice[]) => {
      expect(invoices).toEqual(mockInvoices);
    });

    const req = httpMock.expectOne(`${service.api_storage}/api/v1/invoice/${branchId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoices);
  });


});
