import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/HomePage/HomePage.component';
import { BranchPageComponent } from './pages/BranchPage/BranchPage.component';
import { LoginPageComponent } from './pages/LoginPage/LoginPage.component';

const routes: Routes = [
  {
    path:"",
    pathMatch:"full",
    redirectTo:"home"
  },
  {
    path:"login",
    component: LoginPageComponent,
    pathMatch: 'full'
  },
  {
    path:"home",
    component: HomePageComponent,
  },
  { path: 'branch/:id', component: BranchPageComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
