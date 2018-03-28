# @ngstack/translate

Translation library for Angular applications.

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

```ts
import { TranslateModule } from '@ngstack/translate';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('en');
}

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),

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
- [ ] `<element [attribute]="property | translate"></element>`
- [ ] `<element attribute="{{ property | translate }}"></element>`
- [ ] `<element [innerHTML]="'KEY' | translate"></element>`
- [ ] `<element>{{ 'PROPERTY.PATH' | translate }}</element>`
- [ ] `<element>{{ 'FORMAT' | translate:params }}</element>`
- [ ] `<element [translate]="'KEY'">[text]</element>`
- [ ] `<element [translate]="'KEY'" [translateParams]="JSON"></element>`

### Translate Service

- TBD
