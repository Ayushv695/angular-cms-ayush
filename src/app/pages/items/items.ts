import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item';
import { AuthService } from '../../services/auth';
import { Item } from '../../models/item';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-items',
  imports: [RouterLink],
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
