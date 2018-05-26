import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronComponent } from './electron.component';

describe('ElectronComponent', () => {
  let component: ElectronComponent;
  let fixture: ComponentFixture<ElectronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
