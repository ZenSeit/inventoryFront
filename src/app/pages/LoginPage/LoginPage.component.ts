import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/models/loginRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private formBuilder:FormBuilder,private userService:UserService,private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    });
  }

  login(login:LoginRequest){
    this.userService.login(login).subscribe(
      (res:any)=>{
        setTimeout(()=> {
          this.router.navigateByUrl('/home');
      }, 500);
      },
      err=>{
        console.log(err);
      }
    );
  }
}
