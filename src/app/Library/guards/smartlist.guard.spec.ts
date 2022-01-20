import { TestBed } from '@angular/core/testing';

import { SmartlistGuard } from './smartlist.guard';

describe('SmartlistGuard', () => {
  let guard: SmartlistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SmartlistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
