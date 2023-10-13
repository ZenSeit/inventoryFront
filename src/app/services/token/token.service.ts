import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  setToken() {
    this.tokenSubject.next(localStorage.getItem('token') || null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

}
