import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  login() {
    this.errorMessage = '';

    if (!this.email) {
      this.errorMessage = 'Please enter email.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter password.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authService.setData(response);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.log('error' + error);
        this.errorMessage = error.error?.message || 'Login failed';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
