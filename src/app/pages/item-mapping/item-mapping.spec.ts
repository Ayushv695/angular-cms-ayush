import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMapping } from './item-mapping';

describe('ItemMapping', () => {
  let component: ItemMapping;
  let fixture: ComponentFixture<ItemMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMapping],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemMapping);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
