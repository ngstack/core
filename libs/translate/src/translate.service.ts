import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TranslateService {
  private data: { [key: string]: any } = {};

  private _fallbackLang = 'en';
  private _activeLang = 'en';

  get fallbackLang(): string {
    return this._fallbackLang;
  }

  get activeLang(): string {
    return this._activeLang;
  }

  constructor(private http: HttpClient) {}

  get(key: string, params?: any, lang?: string): string {
    const translation = this.data[lang || this.activeLang] || {};
    return translation[key] || key;
  }

  use(lang: string, data?: any): Promise<any> {

    this._activeLang = lang || this._fallbackLang;

    if (lang && data) {
      this.data[lang] = data;
      return Promise.resolve(data);
    }

    const translation = this.data[lang];

    if (translation) {
      return Promise.resolve(translation);
    }

    return new Promise<any>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || this._fallbackLang}.json`;

      this.http.get<{}>(langPath).subscribe(
        json => {
          this.data[lang] = Object.assign({}, json || {});
          resolve(this.data[lang]);
        },
        error => {
          this.data[lang] = {};
          resolve(this.data[lang]);
        }
      );
    });
  }
}
