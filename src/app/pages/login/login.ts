import { Component } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';

      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);

        localStorage.setItem('token', response.data.token);

        localStorage.setItem('user', JSON.stringify(response.data.user));

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.log(error);

        this.errorMessage = error.error?.message || 'Login failed';
      },
    });
  }
}
