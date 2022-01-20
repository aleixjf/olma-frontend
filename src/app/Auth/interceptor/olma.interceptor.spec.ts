import { TestBed } from '@angular/core/testing';

import { OlmaInterceptorService } from './olma.interceptor';

describe('OlmaInterceptorService', () => {
  let service: OlmaInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlmaInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
