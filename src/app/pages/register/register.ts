import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  role = 'manager';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService
      .register(
        this.name.trim(),
        this.email.trim(),
        this.password,
        this.passwordConfirmation,
        this.role,
      )
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;
          // this.successMessage = 'Registration successful.';
          sessionStorage.setItem('registrationSuccess', 'Registration successful. Please login.');
          this.router.navigate(['/login']);
        },

        error: (error) => {
          console.log(error);
          this.loading = false;

          if (error.error?.errors) {
            const errors = error.error.errors;
            const firstError = Object.values(errors)[0];
            this.errorMessage = Array.isArray(firstError) ? firstError[0] : 'Registration failed.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed.';
          }
          this.cdr.detectChanges();
        },
      });
  }
}
