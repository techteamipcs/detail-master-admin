import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGalleryComponent } from './add-home-gallery.component';

describe('AddGalleryComponent', () => {
  let component: AddGalleryComponent;
  let fixture: ComponentFixture<AddGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
