import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const message = sessionStorage.getItem('registrationSuccess');
    if (message) {
      this.successMessage = message;
      sessionStorage.removeItem('registrationSuccess');
    }
  }

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

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
