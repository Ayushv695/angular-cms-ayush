import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item';
import { AuthService } from '../../services/auth';
import { Item } from '../../models/item';
import { ChangeDetectorRef } from '@angular/core';
// import { RouterLink } from '@angular/router';
import { ItemFormComponent } from './item-form/item-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  imports: [ItemFormComponent, FormsModule],
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
  hasLoaded = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = ''; // for item searching

  // for pagination
  currentPage = 1;
  lastPage = 1;
  totalItems = 0;
  fromItem = 0;
  toItem = 0;
  perPage = 10;
  // end

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
    this.loadItems(1);
  }
  // end

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.loadItems();
  }

  // for item searching
  searchItems(): void {
    // Whenever a new search starts,
    // start from page 1.
    this.loadItems(1);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadItems(1);
  }
  // end

  // for pagination
  previousPage(): void {
    if (this.currentPage <= 1) {
      return;
    }
    this.loadItems(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage >= this.lastPage) {
      return;
    }
    this.loadItems(this.currentPage + 1);
  }

  goToPage(page: number): void {
    if (page < 1) {
      return;
    }
    if (page > this.lastPage) {
      return;
    }
    if (page === this.currentPage) {
      return;
    }
    this.loadItems(page);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.lastPage }, (_, index) => index + 1);
  }

  changePerPage(): void {
    // Whenever per-page changes,
    // go back to page 1.
    this.loadItems(1);
  }
  // end

  loadItems(page: number = 1): void {
    this.loading = true;
    this.errorMessage = '';

    this.itemService.getItems(page, this.searchTerm, this.perPage).subscribe({
      next: (response) => {
        console.log('Items response:', response);
        this.items = response.data;

        this.currentPage = response.meta.current_page;
        this.lastPage = response.meta.last_page;
        this.totalItems = response.meta.total;
        this.fromItem = response.meta.from ?? 0;
        this.toItem = response.meta.to ?? 0;

        this.loading = false;
        this.hasLoaded = true;
        console.log(this.items);
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.hasLoaded = true;
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
    this.loading = true;
    this.itemService.deleteItem(item.id).subscribe({
      next: (response) => {
        console.log('Item deleted:', response);
        this.successMessage = 'Item deleted successfully.';

        if (this.items.length === 1 && this.currentPage > 1) {
          this.loadItems(this.currentPage - 1);
        } else {
          this.loadItems(this.currentPage);
        }
      },

      error: (error) => {
        this.loading = false;
        console.error('Delete Item error:', error);
        this.errorMessage = error.error?.message || 'Unable to delete item.';
        this.cdr.detectChanges();
      },
    });
  }
}
