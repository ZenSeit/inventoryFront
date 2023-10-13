import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from 'src/app/models/loginRequest';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.redirectToContent();
  }

  login(login: LoginRequest) {
    this.userService.login(login).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.tokenService.setToken();
          this.router.navigateByUrl('/home');
        }, 500);
      },
      (err) => {
        this.toastr.error("Invalid credentials", 'Error');
        console.log(err);
      }
    );
  }

  redirectToContent() {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/home');
    }
  }
}
