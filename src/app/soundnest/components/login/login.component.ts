import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/user-auth.service';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LanguageSwitcherComponent, MatToolbar, MatToolbarRow],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/user/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      if (this.authService.currentUserValue?.isOwner) {
        this.router.navigate(['/owner/dashboard']);
      }else{
        this.router.navigate(['user/dashboard']);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user/dashboard';
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (user) => {
          console.log('Login exitososo, navegando segun rol');
          if (user.isOwner) {
            this.router.navigate(['/owner/dashboard']); // Owner's ownerDashboard
          } else {
            this.router.navigate(['/user/dashboard']); // Default Dashboard for regular users
          }
        },
        error: error => {
          this.error = error.message || 'Login failed. Please check your credentials.';
          this.loading = false;
          console.error('Login error:', error);
        }
      });
  }
}
