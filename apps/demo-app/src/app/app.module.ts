import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { TranslateModule, TranslateService } from '@ngstack/translate';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';
import { CustomTranslatePipe } from './translate-demo/custom-translate.pipe';

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
    path: 'translate-lazy',
    loadChildren:
      '@ngstack/translate-lazy-demo/src/translate-lazy-demo.module#TranslateLazyDemoModule'
  },
  {
    path: 'code-editor',
    component: CodeEditorDemoComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    TranslateModule.forRoot(),
    CodeEditorModule,
    MatButtonModule
  ],
  declarations: [
    AppComponent,
    TranslateDemoComponent,
    CodeEditorDemoComponent,
    CustomTranslatePipe
  ],
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
