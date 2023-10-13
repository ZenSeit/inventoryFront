import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  token:string | null = null;
  isValidToken:boolean = false;

  constructor(private router:Router,private tokenService:TokenService,private authJwt: JwtHelperService) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.validateToken();
  }

  returnHome(){
    this.router.navigate(['/']);
  }

  logout(){
    localStorage.clear();
    this.tokenService.setToken();

    this.router.navigate(['/login']);
  }

  validateToken(){
    this.token = localStorage.getItem('token');
    if(this.token){
      this.isValidToken = !this.authJwt.isTokenExpired(this.token);
    }
  }

}
