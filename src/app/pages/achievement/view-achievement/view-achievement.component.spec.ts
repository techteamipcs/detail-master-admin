import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAchievementComponent } from './view-achievement.component';

describe('ViewAchievementComponent', () => {
  let component: ViewAchievementComponent;
  let fixture: ComponentFixture<ViewAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
