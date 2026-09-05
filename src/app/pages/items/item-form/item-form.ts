import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ItemService } from '../../../services/item';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-item-form',
  imports: [FormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css',
})
export class ItemFormComponent implements OnInit {
  // --------------------------------------------------
  // Parent tells us whether this is Add or Edit
  // --------------------------------------------------

  @Input()
  isEditMode = false;

  // --------------------------------------------------
  // Parent gives us the item being edited
  // --------------------------------------------------

  @Input()
  item: Item | null = null;

  // --------------------------------------------------
  // Tell parent to close popup
  // --------------------------------------------------

  @Output()
  close = new EventEmitter<void>();

  // --------------------------------------------------
  // Tell parent item was successfully saved
  // --------------------------------------------------

  @Output()
  saved = new EventEmitter<void>();

  name = '';

  selectedPhoto: File | null = null;
  previewUrl: string | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // If editing, fill the form
    if (this.isEditMode && this.item) {
      this.name = this.item.name;
      this.previewUrl = this.item.photo;
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.selectedPhoto = input.files[0];

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedPhoto);
  }

  saveItem(): void {
    this.errorMessage = '';

    // Basic validation
    if (!this.name.trim()) {
      this.errorMessage = 'Please enter item name.';
      return;
    }

    // If adding, photo is required
    // if (!this.isEditMode && !this.selectedPhoto) {
    //   this.errorMessage = 'Please select a photo.';
    //   return;
    // }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.name.trim());

    // Only append photo if user selected one
    if (this.selectedPhoto) {
      formData.append('photo', this.selectedPhoto);
    }

    // ------------------------------------------
    // EDIT
    // ------------------------------------------
    if (this.isEditMode && this.item) {
      formData.append('_method', 'PUT');
      this.itemService.updateItem(this.item.id, formData).subscribe({
        next: (response) => {
          console.log('Item updated:', response);
          this.loading = false;
          this.saved.emit();
        },

        error: (error) => {
          console.error('Update item error:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Unable to update item.';
          this.cdr.detectChanges();
        },
      });

      return;
    }

    // ------------------------------------------
    // CREATE
    // ------------------------------------------
    this.itemService.createItem(formData).subscribe({
      next: (response) => {
        console.log('Item created:', response);
        this.loading = false;
        this.saved.emit();
      },

      error: (error) => {
        console.error('Create item error:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Unable to create item.';
        this.cdr.detectChanges();
      },
    });
  }

  closePopup(): void {
    if (this.loading) {
      return;
    }
    this.close.emit();
  }
}
