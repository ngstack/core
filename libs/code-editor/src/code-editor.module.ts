import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CodeEditorService } from './code-editor.service';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeEditorComponent],
  exports: [CodeEditorComponent]
})
export class CodeEditorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CodeEditorModule,
      providers: [CodeEditorService]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: CodeEditorModule
    };
  }
}
