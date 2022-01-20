import { TestBed } from '@angular/core/testing';

import { OneDriveOAuthService } from './oauth.onedrive.service';

describe('OneDriveOAuthService', () => {
  let service: OneDriveOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneDriveOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
