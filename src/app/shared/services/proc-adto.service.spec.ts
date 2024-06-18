import { TestBed } from '@angular/core/testing';

import { ProcAdtoService } from './proc-adto.service';

describe('ProcAdtoService', () => {
  let service: ProcAdtoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcAdtoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
