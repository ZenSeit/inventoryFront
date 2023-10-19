import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { LoginRequest } from 'src/app/models/loginRequest';
import { User } from 'src/app/models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user', () => {
    const mockUser: LoginRequest = {
      email: 'email@correo.com',
      password: '12345678',
    };

    service.login(mockUser).subscribe((response) => {
      // Puedes realizar aserciones adicionales si es necesario
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service.api_auth}/api/v1/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser); // Asegúrate de que los datos enviados sean correctos
    req.flush({
      /* Mocked response data */
    });
  });

  it('should create super admin user', () => {
    const mockUser: User = {
      id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email@email.com',
      password: 'password',
      role: 'ADMIN',
      branchId: 'branchId',
    };

    service.createSuperAdmin(mockUser).subscribe((response) => {
      // Puedes realizar aserciones adicionales si es necesario
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/user/registersuper`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser); // Asegúrate de que los datos enviados sean correctos
    req.flush({
      /* Mocked response data */
    });
  });

  it('should create user', () => {
    const mockUser: User = {
      id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email@email.com',
      password: 'password',
      role: 'ADMIN',
      branchId: 'branchId',
    };

    service.createUser(mockUser).subscribe((response) => {
      // Puedes realizar aserciones adicionales si es necesario
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${service.api_service}/api/v1/user/register`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser); // Asegúrate de que los datos enviados sean correctos
    req.flush({
      /* Mocked response data */
    });
  });

  it('should fetch users by branch ID', () => {
    const branchId = 'testBranch';
    const mockUsers: User[] = [
      // Define tus datos de prueba aquí
    ];

    service.getUsersByBranch(branchId).subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(
      `${service.api_storage}/api/v1/users/${branchId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
