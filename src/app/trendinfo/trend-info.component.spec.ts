import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendInfoComponent } from './trend-info.component';

describe('TrendinfoComponent', () => {
  let component: TrendInfoComponent;
  let fixture: ComponentFixture<TrendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
