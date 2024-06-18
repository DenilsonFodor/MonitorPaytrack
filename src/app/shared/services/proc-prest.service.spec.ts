import { TestBed } from '@angular/core/testing';

import { ProcPrestService } from './proc-prest.service';

describe('ProcPrestService', () => {
  let service: ProcPrestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcPrestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
