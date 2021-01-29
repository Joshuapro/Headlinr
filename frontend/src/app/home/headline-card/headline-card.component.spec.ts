import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineCardComponent } from './headline-card.component';

describe('HeadlineCardComponent', () => {
  let component: HeadlineCardComponent;
  let fixture: ComponentFixture<HeadlineCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadlineCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
