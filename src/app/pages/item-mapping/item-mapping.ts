import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Item } from '../../models/item';
import { ItemMappingService } from '../../services/item-mapping';
import { FormsModule } from '@angular/forms';
import { ItemLanguageMapping } from '../../models/item-language-mapping';

@Component({
  selector: 'app-item-mapping',
  imports: [FormsModule],
  templateUrl: './item-mapping.html',
  styleUrl: './item-mapping.css',
})
export class ItemMappingComponent implements OnInit {
  items: Item[] = [];
  errorMessage = '';
  successMessage = '';
  selectedItemId: number | null = null;
  mappings: ItemLanguageMapping[] = [];

  constructor(
    private itemMappingService: ItemMappingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  loadItems(): void {
    this.errorMessage = '';
    this.itemMappingService.getItems().subscribe({
      next: (response) => {
        this.items = response.data;
        console.log('Items:', this.items);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.errorMessage = error.error?.message || 'Failed to load items.';
        this.cdr.detectChanges();
      },
    });
  }

  onItemChange(): void {
    if (!this.selectedItemId) {
      this.mappings = [];
      return;
    }

    this.loadMappings(this.selectedItemId);
  }

  loadMappings(itemId: number): void {
    this.itemMappingService.getMappings(itemId).subscribe({
      next: (response) => {
        console.log('Mappings:', response.data);
        this.mappings = response.data.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading mappings:', error);
        this.mappings = [];
        this.cdr.detectChanges();
      },
    });
  }
}
