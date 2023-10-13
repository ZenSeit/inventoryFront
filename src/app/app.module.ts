import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './pages/HomePage/HomePage.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { BranchPageComponent } from './pages/BranchPage/BranchPage.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './pages/LoginPage/LoginPage.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NotFoundPageComponent } from './pages/NotFoundPage/NotFoundPage.component';
import { InterceptorInterceptor } from './interceptor/interceptor.interceptor';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BranchListComponent,
    HeaderComponent,
    ProductListComponent,
    UserListComponent,
    BranchPageComponent,
    InvoiceListComponent,
    LoginPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
