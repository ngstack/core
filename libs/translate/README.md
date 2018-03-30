# @ngstack/translate

Translation library for Angular applications.

[Live example on Stackblitz](https://stackblitz.com/edit/ngstack-translate-demo)

## Installing

```sh
npm install @ngstack/translate
```

## Using with the application

Create `en.json` file in the `src/app/assets/i18n` folder of your application.

```json
{
  "TITLE": "Hello from NgStack/translate!"
}
```

Import `TranslateModule` into you main application module,
configure `TranslateService` to start automatically during application startup.

You will also need `HttpClientModule` module dependency.

```ts
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngstack/translate';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('en');
}

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),

    HttpClientModule,
    TranslateModule
  ],
  declarations: [AppComponent],
  providers: [

    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

In the main application template, use the following snippet:

```html
<h2>
  {{ 'TITLE' | translate }}
</h2>
```

## Features

### Translate Pipe

- [x] `<element>{{ 'KEY' | translate }}</element>`
- [x] `<element [attribute]="property | translate"></element>`
- [x] `<element attribute="{{ property | translate }}"></element>`
- [x] `<element [innerHTML]="'KEY' | translate"></element>`
- [x] `<element>{{ 'PROPERTY.PATH' | translate }}</element>`
- [x] `<element>{{ 'FORMAT' | translate:params }}</element>`
- [ ] `<element [translate]="'KEY'">[translation]</element>`
- [ ] `<element [translate]="'KEY'" [translateParams]="JSON">[translation]</element>`

### Translate Service

- [x] Translation from code
- [x] Defining translation data from code
- [x] Merging multiple translations
- [ ] Loading data from multiple folders
- [ ] Configurable cache busting
- [ ] Lazy loading support
- [ ] Translation cache

#### Using from code

You can import and use translate service in the code:

```ts
@Component({...})
export class MyComponent {

  text: string;

  constructor(translate: TranslateService) {

    this.text = translate.get('SOME.PROPERTY.PATH');

  }

}
```

#### Custom language without external files

An example for providing translation data from within the application,
without loading external files.

```ts
@NgModule({...})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.use('en', {
      'TITLE': 'Hello from @ngstack/translate!'
    });
  }
}
```

### Formatted translations

You can use runtime string substitution when translating text

```json
{
  "FORMATTED": {
    "HELLO_MESSAGE": "Hello, {username}!"
  }
}
```

Then in the HTML:

```html
<div>{{ 'FORMATTED.HELLO_MESSAGE' | translate:{ 'username': 'world' } }}</div>
```

Or in the Code:

```ts
@Component({...})
export class MyComponent {

  text: string;

  constructor(translate: TranslateService) {

    this.text = translate.get(
      'FORMATTED.HELLO_MESSAGE',
      { username: 'world' }
    );

  }

}
```

Should produce the following result at runtime:

```text
Hello, world!
```
