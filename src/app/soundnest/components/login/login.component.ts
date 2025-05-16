import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/user-auth.service';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LanguageSwitcherComponent, MatToolbar, MatToolbarRow, RouterLink],
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
    // Check if user is already logged in and redirect accordingly
    if (this.authService.isLoggedIn()) {
      this.redirectLoggedInUser();
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return url from route parameters
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
        next: () => {
          console.log('Login exitoso, navegando segun rol');
          this.redirectLoggedInUser();
        },
        error: error => {
          this.error = error.message || 'Login failed. Please check your credentials.';
          this.loading = false;
          console.error('Login error:', error);
        }
      });
  }

  // Helper method to redirect users based on their role
  private redirectLoggedInUser(): void {
    const user = this.authService.currentUserValue;
    if (user?.isOwner) {
      this.router.navigate(['/owner/dashboard']);
    } else {
      // Check if returnUrl is the root path, and if so, redirect to user dashboard
      if (this.returnUrl === '/' || this.returnUrl === '%2F') {
        this.router.navigate(['/user/dashboard']);
      } else {
        this.router.navigate([this.returnUrl]);
      }
    }
  }
}
