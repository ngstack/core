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
   * Editor language. Defaults to `javascript`.
   *
   * @memberof CodeEditorComponent
   */
  @Input() language = 'javascript';

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

  @Output() valueChanged = new EventEmitter<string>();

  constructor(private editorService: CodeEditorService) {}

  ngOnDestroy() {
    if (this._editor) {
      this._editor.dispose();
      this._editor = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !changes.value.firstChange) {
      this.setEditorValue(changes.value.currentValue);
    }

    if (changes.language && !changes.language.firstChange) {
      if (this._editor) {
        monaco.editor.setModelLanguage(
          this._editor.getModel(),
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
    const options = Object.assign({}, this.defaultOptions, this.options, {
      value: this.value,
      language: this.language,
      readOnly: this.readOnly,
      theme: this.theme
    });
    this._editor = monaco.editor.create(domElement, options);

    this._editor.getModel().onDidChangeContent(e => {
      const newValue = this._editor.getModel().getValue();
      if (this._value !== newValue) {
        this._value = newValue;
        this.valueChanged.emit(newValue);
      }
    });

    this.setupTypescriptDefaults();
  }

  private setupTypescriptDefaults() {
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
      // rootDirs: ['/bin/node_modules']
    });

    /*
    typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true
    });
    */

    // const dog = `
    //   declare module 'dog' {
    //       export class Dog {
    //           /** Barks as a dog */
    //           public bark(): string;
    //       }
    //   }`;
    // typescriptDefaults.addExtraLib(dog, 'dog.d.ts');

    // typescriptDefaults.addExtraLib(
    //   'declare var externalLibVar: any;',
    //   'testlib.d.ts'
    // );
  }

  private setEditorValue(value: any): void {
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this._editor) {
        this._editor.getModel().setValue(this.value);
      }
    });
  }
}
