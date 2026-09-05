import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  role: any = null;

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.role = userData.role;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearAuth();
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Logout API failed:', error);
        this.authService.clearAuth();
        this.router.navigate(['/login']);
      },
    });
  }
}
