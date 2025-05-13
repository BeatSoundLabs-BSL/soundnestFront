import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRoomTableComponent } from './owner-room-table.component';

describe('OwnerRoomTableComponent', () => {
  let component: OwnerRoomTableComponent;
  let fixture: ComponentFixture<OwnerRoomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerRoomTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
