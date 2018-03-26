# @ngstack/code-editor

Code editor component for Angular applications.
Based on the [Monaco](https://www.npmjs.com/package/monaco-editor) editor
that powers [VS Code](https://github.com/Microsoft/vscode).

## Installing

```sh
npm install monaco-editor
npm install @ngstack/code-editor
```

## Integrating with Angular CLI project

Update the `.angular-cli.json` file and append the following asset rule:

```json
{
  "glob": "**/*",
  "input": "../node_modules/monaco-editor/min",
  "output": "./assets/monaco"
}
```

Import `CodeEditorModule` into your main application module:

```ts
import { CodeEditorModule } from '@ngstack/code-editor';

@NgModule({
  imports: [
    ...,
    CodeEditorModule
  ],
  ...
})
export class AppModule {}
```

Update template to use the `ngs-code-editor`:

```html
<ngs-code-editor
  [(value)]="code"
  [language]="lang"
  [options]="options"
  [readOnly]="readOnly"
  (valueChanged)="onCodeChanged($event)">
</ngs-code-editor>
```

Update component controller class and provide corresponding properties and events:

```ts
export class AppComponent implements OnInit {

  @Input()
  lang = 'javascript';

  @Input()
  code = 'var x = 1;';

  @Input()
  readOnly = false;

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    console.log('CODE', this.code);
  }

  constructor() {}

  ngOnInit() {}
}
```
