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

  isEditMode = false;
  editingLanguageId: number | null = null;

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

  closeForm(): void {
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingLanguageId = null;
    this.formError = '';
    this.resetForm();
  }

  saveLanguage(): void {
    this.formError = '';
    this.successMessage = '';

    // Frontend validation
    if (!this.newLanguage.name || !this.newLanguage.code) {
      this.formError = 'Please fill in name and code fields.';
      return;
    }

    this.isSaving = true;

    // EDIT

    if (this.isEditMode && this.editingLanguageId !== null) {
      this.languageService.updateLanguage(this.editingLanguageId, this.newLanguage).subscribe({
        next: (response) => {
          console.log('Language updated:', response);
          this.isSaving = false;
          this.closeForm();
          this.successMessage = 'Language updated successfully.';
          this.loadLanguages();
        },

        error: (error) => {
          console.error('Update language error:', error);
          this.isSaving = false;
          this.formError = error.error?.message || 'Unable to update language.';
          this.cdr.detectChanges();
        },
      });

      return;
    }

    // CREATE
    this.languageService.createLanguage(this.newLanguage).subscribe({
      next: (response) => {
        console.log('Language created:', response);

        this.isSaving = false;
        this.closeForm();
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

  editLanguage(language: Language): void {
    this.isEditMode = true;
    this.editingLanguageId = language.id;
    this.showAddForm = true;

    this.formError = '';
    this.successMessage = '';

    this.newLanguage = {
      name: language.name,

      code: language.code,

      native_name: language.native_name ?? '',
    };
  }

  deleteLanguage(language: Language): void {
    const confirmed = confirm(`Are you sure you want to delete "${language.name}"?`);

    if (!confirmed) {
      return;
    }
    this.loading = true;
    this.languageService.deleteLanguage(language.id).subscribe({
      next: (response) => {
        console.log('Language deleted:', response);
        this.successMessage = 'Language deleted successfully.';
        this.loadLanguages();
      },

      error: (error) => {
        console.error('Delete language error:', error);
        this.errorMessage = error.error?.message || 'Unable to delete language.';
        this.cdr.detectChanges();
      },
    });
  }
}
