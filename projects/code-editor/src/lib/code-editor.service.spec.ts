import { TestBed, inject } from '@angular/core/testing';

import { CodeEditorService } from './code-editor.service';

describe('CodeEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeEditorService]
    });
  });

  it('should be created', inject([CodeEditorService], (service: CodeEditorService) => {
    expect(service).toBeTruthy();
  }));
});
