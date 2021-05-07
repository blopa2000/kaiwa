import { TestBed } from '@angular/core/testing';

import { VerifyAccessGuard } from './verify-access.guard';

describe('VerifyAccessGuard', () => {
  let guard: VerifyAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
