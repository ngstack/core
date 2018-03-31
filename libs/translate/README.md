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
    TranslateModule.forRoot()
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

### Translate Service

- [x] Translation from code
- [x] Defining translation data from code
- [x] Merging multiple translations
- [x] Automatic fallback for missing translations
- [x] Defining supported languages
- [ ] Loading data from multiple folders
- [x] Configurable cache busting
- [x] Lazy loading support
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

## Advanced topics

### Cache busting

You can disable browser caching and force application always load translation files by using `TranslateService.disableCache` property.

```ts
export function setupTranslateFactory(service: TranslateService): Function {
  service.disableCache = true;
  return () => service.use('en');
}
```

### Restricting supported languages

It is possible to restrict supported languages to a certain set of values.
You can avoid unnecessary HTTP calls by providing `TranslateService.supportedLangs` values.

```ts
export function setupTranslateFactory(service: TranslateService): Function {
  service.supportedLangs = ['fr', 'de'];
  return () => service.use('en');
}
```

The service will attempt to load resource files only for given set of languages,
and will automatically use fallback language for all unspecified values.

By default this property is empty and service is going to probe all language files.
Active and Fallback languages are always taken into account, even if you do not specify them in the list.

### Using with your own pipes

You are not restricted to using only `TranslatePipe`.
It is possible to use `TranslateService` with your own implementations as well.

You can see the basic pipe implementation below:

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngstack/translate';

@Pipe({
  name: 'myTranslate',
  pure: false
})
export class CustomTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: string, params?: { [key: string]: string }): string {
    return this.translate.get(key, params);
  }
}
```

Then in the HTML templates you can use your pipe like following:

```html
<p>
  Custom Pipe: {{ 'TITLE' | myTranslate }}
</p>
```

## Lazy Loading

To enable Lazy Loading
use `TranslateModule.forRoot()` in the main application,
and `TranslateModule.forChild()` in all lazy-loaded feature modules.

For more details please refer to [Lazy Loading Feature Modules](https://angular.io/guide/lazy-loading-ngmodules)
