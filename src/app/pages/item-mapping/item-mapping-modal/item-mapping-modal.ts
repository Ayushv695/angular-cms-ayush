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
  @Output() saved = new EventEmitter<string>();

  constructor(
    private itemMappingService: ItemMappingService,
    private cdr: ChangeDetectorRef,
  ) {}

  mappingLanguageId: number | null = null;
  translatedName = '';
  translatedAudio: File | null = null;
  audioPreviewUrl: string | null = null;
  isEditMode = false;
  errorMessage = '';
  isSaving = false;

  ngOnInit(): void {
    if (this.mapping) {
      this.isEditMode = true;
      this.mappingLanguageId = this.mapping.language_id;
      this.translatedName = this.mapping.translated_name;
      // this.cdr.detectChanges();
    } else {
      this.isEditMode = false;
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
    this.errorMessage = '';
    if (!this.itemId) {
      this.errorMessage = 'Item is required.';
      return;
    }

    if (!this.mappingLanguageId) {
      this.errorMessage = 'Please select a language.';
      return;
    }

    if (!this.translatedName.trim()) {
      this.errorMessage = 'Please enter translated name.';
      return;
    }

    this.isSaving = true;

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
            this.saved.emit('Mapping updated successfully.');
            this.closeModal();
          },
          error: (error) => {
            this.isSaving = false;
            console.error('Error updating mapping:', error);
            this.errorMessage = error.error?.message || 'Failed to update mapping.';
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
          this.saved.emit('Mapping added successfully.');
          this.closeModal();
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error creating mapping:', error);
          this.errorMessage = error.error?.message || 'Failed to add mapping.';
          this.cdr.detectChanges();
        },
      });
  }
}
