import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { TranslateModule, TranslateService } from '@ngstack/translate';
import { CodeEditorModule } from '@ngstack/code-editor';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';

export function setupTranslateFactory(service: TranslateService): Function {
  // service.disableCache = true;
  return () => service.use('en');
}

const routes: Route[] = [
  {
    path: 'translate',
    component: TranslateDemoComponent
  },
  {
    path: 'code-editor',
    component: CodeEditorDemoComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    TranslateModule,
    CodeEditorModule
  ],
  declarations: [AppComponent, TranslateDemoComponent, CodeEditorDemoComponent],
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
