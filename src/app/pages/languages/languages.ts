import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Language } from '../../models/languages';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-languages',
  imports: [FormsModule],
  templateUrl: './languages.html',
  styleUrl: './languages.css',
})
export class LanguagesComponent implements OnInit {
  languages: Language[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Add form
  showAddForm = false;
  isSaving = false;
  formError = '';
  newLanguage = {
    name: '',
    code: '',
    native_name: '',
  };

  constructor(
    private languageService: LanguageService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.loading = true;
    this.errorMessage = '';

    this.languageService.getLanguages().subscribe({
      next: (response) => {
        // console.log('Languages:', response.data);

        this.languages = response.data;

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.log(error);
        this.errorMessage = error.error?.message || 'Failed to load languages';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.formError = '';
    this.successMessage = '';
  }

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.formError = '';
    this.resetForm();
  }

  resetForm(): void {
    this.newLanguage = {
      name: '',
      code: '',
      native_name: '',
    };
  }

  createLanguage(): void {
    this.formError = '';
    this.successMessage = '';

    // Frontend validation
    if (!this.newLanguage.name || !this.newLanguage.code) {
      this.formError = 'Please fill in name and code fields.';
      return;
    }

    this.isSaving = true;

    this.languageService.createLanguage(this.newLanguage).subscribe({
      next: (response) => {
        console.log('Language created:', response);

        this.isSaving = false;
        this.showAddForm = false;
        this.resetForm();
        this.successMessage = 'Language created successfully.';
        // Reload list
        this.loadLanguages();
      },

      error: (error) => {
        console.log('Create language error:', error);

        this.isSaving = false;

        if (error.status === 422) {
          this.formError = error.error?.message || 'Please check the entered information.';
        } else {
          this.formError = error.error?.message || 'Unable to create language.';
        }
        this.cdr.detectChanges();
      },
    });
  }
}
