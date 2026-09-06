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

  editingMapping: ItemLanguageMapping | null = null;

  isLoadingItems = false;
  isLoadingMappings = false;

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
    this.isLoadingItems = true;
    this.itemMappingService.getItems().subscribe({
      next: (response) => {
        this.items = response.data;
        this.isLoadingItems = false;
        console.log('Items:', this.items);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoadingItems = false;
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
    this.isLoadingMappings = true;
    this.itemMappingService.getMappings(itemId).subscribe({
      next: (response) => {
        console.log('Mappings:', response.data);
        this.mappings = response.data.translations.data;
        this.availableLanguages = response.data.languages_available_for_mapping;
        this.isLoadingMappings = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoadingMappings = false;
        console.error('Error loading mappings:', error);
        this.mappings = [];
        this.availableLanguages = [];
        this.cdr.detectChanges();
      },
    });
  }

  openAddMappingModal(): void {
    if (!this.selectedItemId) {
      this.errorMessage = 'Please select an item first.';
      return;
    }
    this.editingMapping = null;
    this.showMappingModal = true;
  }

  closeMappingModal(): void {
    this.showMappingModal = false;
  }

  openEditMappingModal(mapping: ItemLanguageMapping): void {
    this.editingMapping = mapping;
    this.showMappingModal = true;
  }

  deleteMapping(mapping: ItemLanguageMapping): void {
    const confirmed = confirm(`Are you sure you want to delete this mapping`);

    if (!confirmed) {
      return;
    }
    // this.loading = true;
    this.itemMappingService.deleteMapping(mapping.id).subscribe({
      next: (response) => {
        console.log('Mapping deleted:', response);
        this.successMessage = 'Mapping deleted successfully.';
        // this.cdr.detectChanges();
        if (this.selectedItemId) {
          this.loadMappings(this.selectedItemId);
        }
      },

      error: (error) => {
        console.error('Delete Mapping error:', error);
        this.errorMessage = error.error?.message || 'Unable to delete mapping.';
        if (this.selectedItemId) {
          this.loadMappings(this.selectedItemId);
        }
      },
    });
  }

  onMappingSaved(message: string): void {
    this.successMessage = message;

    if (this.selectedItemId) {
      this.loadMappings(this.selectedItemId);
    }
  }
}
