import { TestBed } from '@angular/core/testing';

import { PlaintesService } from './plaintes.service';

describe('PlaintesService', () => {
  let service: PlaintesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaintesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
