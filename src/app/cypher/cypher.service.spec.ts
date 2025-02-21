import { TestBed } from '@angular/core/testing';

import { CypherService } from './cypher.service';

describe('CypherService', () => {
  let service: CypherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CypherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
