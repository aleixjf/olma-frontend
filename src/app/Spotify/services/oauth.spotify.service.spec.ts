import { TestBed } from '@angular/core/testing';

import { SpotifyOAuthService } from './oauth.spotify.service';

describe('SpotifyOAuthService', () => {
  let service: SpotifyOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
