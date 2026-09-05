import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item';
import { AuthService } from '../../services/auth';
import { Item } from '../../models/item';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemFormComponent } from './item-form/item-form';

@Component({
  selector: 'app-items',
  imports: [RouterLink, ItemFormComponent],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class ItemsComponent implements OnInit {
  constructor(
    private itemService: ItemService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  items: Item[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  // for item popup model
  showItemForm = false;
  isEditMode = false;
  selectedItem: Item | null = null;

  openAddItem(): void {
    this.isEditMode = false;
    this.selectedItem = null;
    this.showItemForm = true;
  }

  openEditItem(item: Item): void {
    this.isEditMode = true;
    this.selectedItem = item;
    this.showItemForm = true;
  }

  closeItemForm(): void {
    this.showItemForm = false;
    this.isEditMode = false;
    this.selectedItem = null;
  }

  onItemSaved(): void {
    const message = this.isEditMode ? 'Item updated successfully.' : 'Item created successfully.';
    this.closeItemForm();
    this.successMessage = message;
    this.loadItems();
  }
  // end

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.errorMessage = '';

    this.itemService.getItems().subscribe({
      next: (response) => {
        console.log('Items response:', response);
        this.items = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.log(error);
        this.errorMessage = error.error?.message || 'Failed to load items.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteItem(item: Item): void {
    const confirmed = confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    this.itemService.deleteItem(item.id).subscribe({
      next: (response) => {
        console.log('Item deleted:', response);
        this.successMessage = 'Item deleted successfully.';
        this.loadItems();
      },

      error: (error) => {
        console.error('Delete Item error:', error);
        this.errorMessage = error.error?.message || 'Unable to delete item.';
        this.cdr.detectChanges();
      },
    });
  }
}
