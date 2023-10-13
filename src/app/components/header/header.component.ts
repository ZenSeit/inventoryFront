import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  token:string | null = null;

  constructor(private router:Router,private tokenService:TokenService) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
  }

  returnHome(){
    this.router.navigate(['/']);
  }

  logout(){
    localStorage.clear();
    this.tokenService.setToken();

    this.router.navigate(['/login']);
  }

}
