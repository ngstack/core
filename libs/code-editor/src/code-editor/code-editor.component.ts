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

  ngAfterViewInit() {
    const onGotAmdLoader = () => {
      // Load monaco
      (<any>window).require.config({ paths: { vs: 'assets/monaco/vs' } });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    // Load AMD loader if necessary
    if (!(<any>window).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }

  private initMonaco() {
    const myDiv: HTMLDivElement = this.editorContent.nativeElement;
    const options = Object.assign({}, this.defaultOptions, this.options, {
      value: this.value,
      language: this.language,
      readOnly: this.readOnly,
      theme: this.theme
    });
    this._editor = monaco.editor.create(myDiv, options);

    this._editor.getModel().onDidChangeContent(e => {
      const newValue = this._editor.getModel().getValue();
      if (this._value !== newValue) {
        this._value = newValue;
        this.valueChanged.emit(newValue);
      }
    });
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
