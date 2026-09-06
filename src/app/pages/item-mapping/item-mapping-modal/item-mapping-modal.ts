import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Language } from '../../../models/languages';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-mapping-modal',
  imports: [FormsModule],
  templateUrl: './item-mapping-modal.html',
  styleUrl: './item-mapping-modal.css',
})
export class ItemMappingModalComponent {
  @Input() languages: Language[] = [];

  @Input() itemId: number | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  mappingLanguageId: number | null = null;
  translatedName = '';
  translatedAudio: File | null = null;
  audioPreviewUrl: string | null = null;

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
}
