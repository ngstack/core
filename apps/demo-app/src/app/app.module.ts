import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { TranslateModule, TranslateService } from '@ngstack/translate';
import { CodeEditorModule, CodeEditorService } from '@ngstack/code-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app.component';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CodeEditorDemoComponent } from './code-editor-demo/code-editor-demo.component';
import { CustomTranslatePipe } from './translate-demo/custom-translate.pipe';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('en');
}

export function setupCodeEditorFactory(service: CodeEditorService): Function {
  return () => {
    // Uncomment to use local Monaco installation
    service.baseUrl = 'assets/monaco';
    // Uncomment to use local Typings Worker
    service.typingsWorkerUrl = 'assets/workers/typings-worker.js';
  };
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
    CodeEditorModule.forRoot(),
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [
    AppComponent,
    TranslateDemoComponent,
    CodeEditorDemoComponent,
    CustomTranslatePipe
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: setupCodeEditorFactory,
      deps: [CodeEditorService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
