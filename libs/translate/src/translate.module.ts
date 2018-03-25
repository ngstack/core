import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from './translate.service';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [TranslateService],
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class TranslateModule {}
