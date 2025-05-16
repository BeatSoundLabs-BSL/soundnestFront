import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoomTableComponent } from './user-room-table.component';

describe('UserRoomTableComponent', () => {
  let component: UserRoomTableComponent;
  let fixture: ComponentFixture<UserRoomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoomTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
