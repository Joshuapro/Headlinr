import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // apiUrl: String = "http://localhost:5000/api/"
  apiUrl: String = "https://head-linr.herokuapp.com/api/";

  constructor(private _http: HttpClient, private _router: Router) {}

  loginUser(userInfo): Observable<any> {
    return this._http.post<any>(this.apiUrl + `loginAuth`, userInfo);
  }

  registerUser(userInfo): Observable<any> {
    return this._http.post<any>(this.apiUrl + `registerAuth`, userInfo);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this._router.navigate(['/home']);
  }
}
