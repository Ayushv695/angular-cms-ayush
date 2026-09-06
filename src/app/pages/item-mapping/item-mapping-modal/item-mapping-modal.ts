import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from '../../../models/languages';
import { FormsModule } from '@angular/forms';
import { ItemMappingService } from '../../../services/item-mapping';
import { ItemLanguageMapping } from '../../../models/item-language-mapping';

@Component({
  selector: 'app-item-mapping-modal',
  imports: [FormsModule],
  templateUrl: './item-mapping-modal.html',
  styleUrl: './item-mapping-modal.css',
})
export class ItemMappingModalComponent implements OnInit {
  @Input() languages: Language[] = [];
  @Input() itemId: number | null = null;
  @Input() mapping: ItemLanguageMapping | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  constructor(
    private itemMappingService: ItemMappingService,
    private cdr: ChangeDetectorRef,
  ) {}

  mappingLanguageId: number | null = null;
  translatedName = '';
  translatedAudio: File | null = null;
  audioPreviewUrl: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    if (this.mapping) {
      this.isEditMode = true;

      this.mappingLanguageId = this.mapping.language_id;
      this.translatedName = this.mapping.translated_name;

      console.log('Edit mapping:', this.mapping);
      console.log('Selected language:', this.mappingLanguageId);
      // this.cdr.detectChanges();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.translatedAudio = input.files[0];
      this.audioPreviewUrl = URL.createObjectURL(this.translatedAudio);
      this.cdr.detectChanges();
    }
  }

  saveMapping(): void {
    if (!this.itemId) {
      alert('Item is required.');
      return;
    }

    if (!this.mappingLanguageId) {
      alert('Please select a language.');
      return;
    }

    if (!this.translatedName.trim()) {
      alert('Please enter translated name.');
      return;
    }

    // EDIT
    if (this.mapping) {
      this.itemMappingService
        .updateMapping(
          this.mapping.id,
          this.itemId,
          this.mappingLanguageId,
          this.translatedName.trim(),
          this.translatedAudio,
        )
        .subscribe({
          next: (response) => {
            console.log('Mapping updated:', response);
            alert('Mapping updated successfully.');
            this.saved.emit();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating mapping:', error);
            alert(error.error?.message || 'Failed to update mapping.');
            this.cdr.detectChanges();
          },
        });

      return;
    }

    // ADD
    this.itemMappingService
      .createMapping(
        this.itemId,
        this.mappingLanguageId,
        this.translatedName.trim(),
        this.translatedAudio,
      )
      .subscribe({
        next: (response) => {
          console.log('Mapping created:', response);
          alert('Mapping added successfully.');
          this.saved.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating mapping:', error);
          alert(error.error?.message || 'Failed to add mapping.');
          this.cdr.detectChanges();
        },
      });
  }
}
