import { TestBed } from '@angular/core/testing';

import { DropboxInterceptorService } from './dropbox.interceptor';

describe('DropboxInterceptorService', () => {
  let service: DropboxInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropboxInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
