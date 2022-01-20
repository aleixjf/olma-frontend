import { TestBed } from '@angular/core/testing';

import { OneDriveInterceptorService } from './onedrive.interceptor';

describe('OneDriveInterceptorService', () => {
  let service: OneDriveInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneDriveInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
