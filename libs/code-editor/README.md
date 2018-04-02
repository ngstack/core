# @ngstack/code-editor

Code editor component for Angular applications.
Based on the [Monaco](https://www.npmjs.com/package/monaco-editor) editor
that powers [VS Code](https://github.com/Microsoft/vscode).

## Live demos

* [Angular example (Stackblitz)](https://stackblitz.com/edit/ngstack-code-editor?file=app%2Fapp.component.html)

## Installing

```sh
npm install @ngstack/code-editor
```

## Integrating with Angular CLI project

Import `CodeEditorModule` into your main application module:

```ts
import { CodeEditorModule } from '@ngstack/code-editor';

@NgModule({
  imports: [
    ...,
    CodeEditorModule.forRoot()
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

## Offline Setup

You can run the editor in the offline mode with your Angular CLI application using the following steps:

Install the `monaco-editor`:

```sh
npm install monaco-editor
```

Update the `.angular-cli.json` file and append the following asset rule:

```json
{
  "glob": "**/*",
  "input": "../node_modules/monaco-editor/min",
  "output": "./assets/monaco"
}
```

Update the main application module and setup the service to use the custom `baseUrl` when application starts:

```ts
import { CodeEditorModule, CodeEditorService } from '@ngstack/code-editor';

export function setupCodeEditorFactory(service: CodeEditorService): Function {
  return () => {
    service.baseUrl = 'assets/monaco';
  };
}

@NgModule({
  ...,
  imports: [
    ...,
    CodeEditorModule.forRoot()
  ],
  providers: [
    ...,
    {
      provide: APP_INITIALIZER,
      useFactory: setupCodeEditorFactory,
      deps: [CodeEditorService],
      multi: true
    }
  ],
  ...
})
export class AppModule {}
```

## Lazy Loading

To enable Lazy Loading
use `CodeEditorModule.forRoot()` in the main application,
and `CodeEditorModule.forChild()` in all lazy-loaded feature modules.

For more details please refer to [Lazy Loading Feature Modules](https://angular.io/guide/lazy-loading-ngmodules)
