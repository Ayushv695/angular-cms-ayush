import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Item } from '../../models/item';
import { ItemMappingService } from '../../services/item-mapping';
import { FormsModule } from '@angular/forms';
import { ItemLanguageMapping } from '../../models/item-language-mapping';
import { Language } from '../../models/languages';
import { ItemMappingModalComponent } from './item-mapping-modal/item-mapping-modal';

@Component({
  selector: 'app-item-mapping',
  imports: [FormsModule, ItemMappingModalComponent],
  templateUrl: './item-mapping.html',
  styleUrl: './item-mapping.css',
})
export class ItemMappingComponent implements OnInit {
  items: Item[] = [];
  errorMessage = '';
  successMessage = '';
  selectedItemId: number | null = null;
  mappings: ItemLanguageMapping[] = [];

  showMappingModal = false;
  languages: Language[] = [];
  availableLanguages: Language[] = [];

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
        this.mappings = response.data.translations.data;
        this.availableLanguages = response.data.languages_available_for_mapping;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading mappings:', error);
        this.mappings = [];
        this.availableLanguages = [];
        this.cdr.detectChanges();
      },
    });
  }

  openAddMappingModal(): void {
    if (!this.selectedItemId) {
      alert('Please select an item first.');
      return;
    }
    this.showMappingModal = true;
  }

  closeMappingModal(): void {
    this.showMappingModal = false;
  }
}
