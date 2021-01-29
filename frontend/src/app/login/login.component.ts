import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  get username() {
    return this.loginForm.get("username");
  }

  get password() {
    return this.loginForm.get("password");
  }

  constructor(
    private _authService: AuthService,
    private fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    const userInfo = {
      username: this.username.value,
      password: this.password.value,
    };
    console.log(userInfo);
    this._authService.loginUser(userInfo).subscribe(
      (res) => {
        console.log(res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', this.username.value);
        this._router.navigate(['/home']);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }
}
