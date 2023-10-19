import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'src/app/services/token/token.service';
import { JwtModule } from '@auth0/angular-jwt';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let tokenService: TokenService;
  let jwtHelperService: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem('token'); // Ajusta según cómo obtienes el token en tu aplicación
            },
            allowedDomains: ['example.com'], // Reemplaza con tus dominios permitidos
          },
        }),
      ],
      providers: [Router, TokenService, JwtHelperService],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
    jwtHelperService = TestBed.inject(JwtHelperService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on returnHome()', () => {
    spyOn(router, 'navigate');
    component.returnHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should clear local storage and navigate to login on logout()', () => {
    spyOn(localStorage, 'clear');
    spyOn(tokenService, 'setToken');
    spyOn(router, 'navigate');

    component.logout();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(tokenService.setToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
