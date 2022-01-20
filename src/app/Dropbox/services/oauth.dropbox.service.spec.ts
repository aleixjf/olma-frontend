import { TestBed } from '@angular/core/testing';

import { DropboxOAuthService } from './oauth.dropbox.service';

describe('DropboxOAuthService', () => {
  let service: DropboxOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropboxOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
