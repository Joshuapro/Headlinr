import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;

  get userName() {
    return this.registrationForm.get('userName');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  constructor(
    private _authService: AuthService,
    private fb: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register(): void {
    const userInfo = {
      username: this.userName.value,
      password: this.password.value,
    };
    console.log(userInfo);
    this._authService.registerUser(userInfo).subscribe(
      (res) => {
        console.log('success');
        localStorage.setItem('token', res.token);
        this._router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
