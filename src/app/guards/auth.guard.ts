import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router,private authJwt: JwtHelperService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Verificar si el token está presente en el almacenamiento local
    const token = localStorage.getItem('token');
    //console.log(token);
    if (token) {
      if (!this.authJwt.isTokenExpired(token)) {
        //this.router.navigate(['/home']);
        return true;
      }
    }
      // Si el token no existe, redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    
  }

}
