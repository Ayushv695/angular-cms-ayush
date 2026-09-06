import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMappingModal } from './item-mapping-modal';

describe('ItemMappingModal', () => {
  let component: ItemMappingModal;
  let fixture: ComponentFixture<ItemMappingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMappingModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMappingModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
