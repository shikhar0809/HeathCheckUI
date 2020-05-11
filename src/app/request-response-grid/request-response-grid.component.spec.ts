import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResponseGridComponent } from './request-response-grid.component';

describe('RequestResponseGridComponent', () => {
  let component: RequestResponseGridComponent;
  let fixture: ComponentFixture<RequestResponseGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestResponseGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestResponseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
