import { TestBed } from '@angular/core/testing';

import { ApiPuppeteerService } from './api-puppeteer.service';

describe('ApiPuppeteerService', () => {
  let service: ApiPuppeteerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPuppeteerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
