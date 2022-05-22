import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryTrackerComponent } from './expiry-tracker.component';

describe('ExpiryTrackerComponent', () => {
  let component: ExpiryTrackerComponent;
  let fixture: ComponentFixture<ExpiryTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiryTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
