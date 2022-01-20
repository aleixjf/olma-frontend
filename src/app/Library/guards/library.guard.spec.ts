import { TestBed } from '@angular/core/testing';

import { LibraryGuard } from './library.guard';

describe('LibraryGuard', () => {
  let guard: LibraryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LibraryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
