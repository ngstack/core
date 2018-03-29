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

## Custom language without external files

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

## Features

### Translate Pipe

- [x] `<element>{{ 'KEY' | translate }}</element>`
- [x] `<element [attribute]="property | translate"></element>`
- [x] `<element attribute="{{ property | translate }}"></element>`
- [x] `<element [innerHTML]="'KEY' | translate"></element>`
- [ ] `<element>{{ 'PROPERTY.PATH' | translate }}</element>`
- [ ] `<element>{{ 'FORMAT' | translate:params }}</element>`
- [ ] `<element [translate]="'KEY'">[translation]</element>`
- [ ] `<element [translate]="'KEY'" [translateParams]="JSON">[translation]</element>`

### Translate Service

- TBD
