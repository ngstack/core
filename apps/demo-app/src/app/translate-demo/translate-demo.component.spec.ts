import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateDemoComponent } from './translate-demo.component';
import { TranslateModule } from '@ngstack/translate';

describe('TranslateDemoComponent', () => {
  let component: TranslateDemoComponent;
  let fixture: ComponentFixture<TranslateDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule],
      declarations: [ TranslateDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
