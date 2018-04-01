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
  theme="vs-dark"
  language="javascript"
  [(value)]="code"
  [options]="options"
  (valueChanged)="onCodeChanged($event)">
</ngs-code-editor>
```

Update component controller class and provide corresponding properties and events:

```ts
export class AppComponent {
  @Input() code = 'var x = 1;';

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  onCodeChanged(value) {
    console.log('CODE', this.code);
  }
}
```

## Input Properties

| Name     | Type    | Default Value | Description                                                  |
| -------- | ------- | ------------- | ------------------------------------------------------------ |
| theme    | string  | vs            | Editor theme. Allowed values: `vs`, `vs-dark` or `hc-black`. |
| language | string  | javascript    | Editor language.                                             |
| options  | Object  | {...}         | Editor options.                                              |
| readOnly | boolean | false         | Toggles readonly state of the editor.                        |
| value    | string  |               | Editor text value.                                           |

### Editor Options

For available options see [IEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html) docs.

The following options are used by default when Editor Component gets created:

```json
{
  "lineNumbers": true,
  "contextmenu": false,
  "minimap": {
    "enabled": false
  }
}
```

## Output Events

| Name         | Argument Type | Description                             |
| ------------ | ------------- | --------------------------------------- |
| valueChanged | string        | Raised after editor value gets changed. |
