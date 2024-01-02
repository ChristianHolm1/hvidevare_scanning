import { TestBed } from '@angular/core/testing';

import { ApiMongoService } from './api-mongo.service';

describe('ApiMongoService', () => {
  let service: ApiMongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
