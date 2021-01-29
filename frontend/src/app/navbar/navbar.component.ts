import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  get username() {
    return localStorage.getItem('userName');
  }

  constructor(private _authService: AuthService) { }

  logout(): void {
    this._authService.logout();
  }

  loggedIn(): boolean {
    return this._authService.loggedIn();
  }

  ngOnInit(): void {
  }

}
