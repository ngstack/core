import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from './translate.service';
import { TranslatePipe } from './translate.pipe';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class TranslateModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [TranslateService]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    };
  }
}
