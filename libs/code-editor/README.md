# @ngstack/code-editor

Code editor component for Angular applications.
Based on the [Monaco](https://www.npmjs.com/package/monaco-editor) editor
that powers [VS Code](https://github.com/Microsoft/vscode).

## Installing

```sh
npm install monaco-editor
npm install @ngstack/translate
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
