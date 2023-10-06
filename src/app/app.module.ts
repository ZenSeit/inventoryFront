import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './pages/HomePage/HomePage.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { BranchPageComponent } from './pages/BranchPage/BranchPage.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BranchListComponent,
    HeaderComponent,
    ProductListComponent,
    BranchPageComponent,
    InvoiceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
