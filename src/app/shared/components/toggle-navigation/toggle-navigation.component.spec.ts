import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleNavigationComponent } from './toggle-navigation.component';

describe('ToggleNavigationComponent', () => {
  let component: ToggleNavigationComponent;
  let fixture: ComponentFixture<ToggleNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
