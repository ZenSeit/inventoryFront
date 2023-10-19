import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BranchesService } from './branches.service';
import { Branch } from 'src/app/models/branch';
import { NewBranch } from 'src/app/models/newBranch';

describe('BranchesService', () => {
  let service: BranchesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BranchesService],
    });
    service = TestBed.inject(BranchesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should fetch branches', () => {
    const mockBranches: Branch[] = [
      // Define tus datos de prueba aquí
    ];

    service.getBranches().subscribe((branches: Branch[]) => {
      expect(branches).toEqual(mockBranches);
    });

    const req = httpMock.expectOne(`${service.api_storage}/api/v1/branch`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBranches);
  });

  it('should fetch branch by ID', () => {
    const mockBranch: Branch = {
      id: 'branchId',
      name: 'branch',
      location: 'location',
    };

    const branchId = 'branchId';
    service.getBranchById(branchId).subscribe((branch: Branch) => {
      expect(branch).toEqual(mockBranch);
    });

    const req = httpMock.expectOne(
      `${service.api_storage}/api/v1/branch/${branchId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBranch);
  });

  it('should create a new branch', () => {
    const mockNewBranch: NewBranch = {
      name: 'branch',
      location: {
        city: 'city',
        country: 'country',
      },
    };

    service.createBranch(mockNewBranch).subscribe(() => {

    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/branch/register`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockNewBranch); 
    req.flush({});
  });
});
