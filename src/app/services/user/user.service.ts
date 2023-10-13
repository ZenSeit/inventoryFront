import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from 'src/app/models/loginRequest';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api_service: string = `http://${window._env.SERVICE_URI}`;
  api_auth: string = `http://${window._env.AUTH_URI}`;

  constructor(private http: HttpClient) {}

  login(user: LoginRequest) {
    return this.http.post(`${this.api_auth}/api/v1/auth/login`, user);
  }

  createSuperAdmin(user: User) {
    return this.http.post(
      `${this.api_service}/api/v1/user/registersuper`,
      user
    );
  }

  createUser(user: User) {
    return this.http.post(`${this.api_service}/api/v1/user/register`, user);
  }
}
