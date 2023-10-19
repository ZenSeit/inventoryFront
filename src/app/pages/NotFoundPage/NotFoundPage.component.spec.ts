import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundPageComponent } from './NotFoundPage.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { JwtModule } from '@auth0/angular-jwt';


describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundPageComponent, HeaderComponent], // Asegúrate de incluir HeaderComponent
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include app-header in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});

