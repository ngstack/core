import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';

import { CodeEditorService } from './../code-editor.service';

declare const monaco: any;

@Component({
  selector: 'ngs-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: { class: 'ngs-code-editor' }
})
export class CodeEditorComponent
  implements OnChanges, OnDestroy, AfterViewInit {
  private _editor: any;
  private model: any;
  private _value = '';

  private defaultOptions = {
    lineNumbers: true,
    contextmenu: false,
    minimap: {
      enabled: false
    }
  };

  @ViewChild('editor') editorContent: ElementRef;

  @Input()
  set value(v: string) {
    if (v !== this._value) {
      this._value = v;
      this.setEditorValue(v);
      this.valueChanged.emit(v);
    }
  }

  get value(): string {
    return this._value;
  }

  /**
   * Editor theme. Defaults to `vs`.
   *
   * Allowed values: `vs`, `vs-dark` or `hc-black`.
   * @memberof CodeEditorComponent
   */
  @Input() theme = 'vs';

  /**
   * Editor language. Defaults to `typescript`.
   *
   * @memberof CodeEditorComponent
   */
  @Input() language = 'typescript';

  /**
   * Editor options.
   *
   * See https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html for more details.
   *
   * @memberof CodeEditorComponent
   */
  @Input() options = {};

  /**
   * Toggle readonly state of the editor.
   *
   * @memberof CodeEditorComponent
   */
  @Input() readOnly = false;

  @Input() dependencies: string[] = [];

  @Output() valueChanged = new EventEmitter<string>();

  constructor(private editorService: CodeEditorService) {
    editorService.typingsLoaded.subscribe(typings => {
      if (this.language && this.language.toLowerCase() === 'typescript') {
        // undocumented API
        const libs = monaco.languages.typescript.typescriptDefaults.getExtraLibs();

        typings.forEach(t => {
          if (!libs[t.path]) {
            // TODO: needs performance improvements, recreates its worker each time
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              t.content,
              t.path
            );
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this._editor) {
      this._editor.dispose();
      this._editor = null;
    }

    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.firstChange) {
      this.setEditorValue(changes.value.currentValue);
    }

    if (changes.language && !changes.language.firstChange) {
      if (this._editor) {
        monaco.editor.setModelLanguage(
          this.model,
          changes.language.currentValue
        );
      }
    }

    if (changes.readOnly && !changes.readOnly.firstChange) {
      if (this._editor) {
        this._editor.updateOptions({
          readOnly: changes.readOnly.currentValue
        });
      }
    }

    if (changes.theme && !changes.theme.firstChange) {
      monaco.editor.setTheme(changes.theme.currentValue);
    }
  }

  async ngAfterViewInit() {
    await this.editorService.loadEditor();
    this.initMonaco();
  }

  private initMonaco() {
    const domElement: HTMLDivElement = this.editorContent.nativeElement;

    let uri = null;
    if (this.language && this.language.toLowerCase() === 'typescript') {
      uri = new monaco.Uri('main.ts');
    }

    this.model = monaco.editor.createModel(this.value, this.language, uri);

    const options = Object.assign({}, this.defaultOptions, this.options, {
      readOnly: this.readOnly,
      theme: this.theme,
      model: this.model
    });

    this._editor = monaco.editor.create(domElement, options);

    this.model.onDidChangeContent(e => {
      const newValue = this.model.getValue();
      if (this._value !== newValue) {
        this._value = newValue;
        this.valueChanged.emit(newValue);
      }
    });

    if (this.language && this.language.toLowerCase() === 'typescript') {
      this.setupTypescriptDefaults();
    }
  }

  private async setupTypescriptDefaults() {
    const typescriptDefaults = monaco.languages.typescript.typescriptDefaults;

    typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      module: 'commonjs',
      noEmit: true,
      noLib: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowNonTsExtensions: true,
      declaration: true
    });

    typescriptDefaults.setMaximunWorkerIdleTime(-1);
    typescriptDefaults.setEagerModelSync(true);

    /*
    typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
    */

    if (this.dependencies && this.dependencies.length > 0) {
      this.editorService.loadTypings(this.dependencies);
    }
  }

  private setEditorValue(value: any): void {
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this.model) {
        this.model.setValue(this.value);
      }
    });
  }
}
