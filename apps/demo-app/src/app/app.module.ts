import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { TranslateModule } from '@ngstack/translate';

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    TranslateModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
