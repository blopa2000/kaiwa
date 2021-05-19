import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUserViewComponent } from './contact-user-view.component';

describe('ContactUserViewComponent', () => {
  let component: ContactUserViewComponent;
  let fixture: ComponentFixture<ContactUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUserViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
