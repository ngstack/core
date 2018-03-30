import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorDemoComponent } from './code-editor-demo.component';

describe('CodeEditorDemoComponent', () => {
  let component: CodeEditorDemoComponent;
  let fixture: ComponentFixture<CodeEditorDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEditorDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
