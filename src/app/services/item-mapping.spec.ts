import { TestBed } from '@angular/core/testing';

import { ItemMapping } from './item-mapping';

describe('ItemMapping', () => {
  let service: ItemMapping;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemMapping);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
