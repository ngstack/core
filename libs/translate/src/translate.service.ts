import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TranslateService {
  private data: { [key: string]: any } = {};

  private _fallbackLang = 'en';
  private _activeLang = 'en';

  /**
   * Disable caching and always download language files.
   *
   * Applies cache busting query parameters to urls, for example: '?v=1522426955882'.
   */
  disableCache = false;

  /**
   * Define supported languages.
   *
   * The service will attempt to load resource files only for given set of languages,
   * and will automatically use fallback language for all unspecified values.
   *
   * By default this property is empty and service is going to probe all language files.
   * Active and Fallback languages are always taken into account even if you do not specify them in the list.
   */
  supportedLangs: string[] = [];

  get fallbackLang(): string {
    return this._fallbackLang;
  }

  set fallbackLang(value: string) {
    this._fallbackLang = value || 'en';
  }

  get activeLang(): string {
    return this._activeLang;
  }

  set activeLang(value: string) {
    this._activeLang = value || this.fallbackLang;
  }

  constructor(private http: HttpClient) {}

  get(key: string, params?: { [key: string]: string }, lang?: string): string {
    if (key) {
      let value = this.getValue(lang || this.activeLang, key);
      if (value === key) {
        value = this.getValue(this.fallbackLang, key);
      }
      return this.format(value, params);
    } else {
      return null;
    }
  }

  use(lang: string, data?: any): Promise<any> {
    if (lang && data) {
      return Promise.resolve(this.setTranslation(lang, data));
    }

    let translation = this.data[lang];
    if (this.isNotSupported(lang)) {
      translation = this.data[this.fallbackLang];
    }

    if (translation && Object.keys(translation).length > 0) {
      return Promise.resolve(translation);
    }

    return new Promise<any>((resolve, reject) => {
      let langPath = `assets/i18n/${lang || this._fallbackLang}.json`;

      if (this.disableCache) {
        langPath += `?v=${Date.now()}`;
      }

      this.http.get<{}>(langPath).subscribe(
        json => {
          resolve(this.setTranslation(lang, json));
        },
        error => {
          resolve(this.data[lang] || {});
        }
      );
    });
  }

  private isNotSupported(lang): boolean {
    return (
      lang !== this.fallbackLang &&
      lang !== this.activeLang &&
      (this.supportedLangs &&
        this.supportedLangs.length > 0 &&
        !this.supportedLangs.includes(lang))
    );
  }

  private getValue(lang: string, key: string): string {
    let data = this.data[lang];
    if (this.isNotSupported(lang)) {
      data = this.data[this.fallbackLang];
    }

    if (!data) {
      return key;
    }

    const keys = key.split('.');
    let propKey = '';

    do {
      propKey += keys.shift();
      const value = data[propKey];
      if (value !== undefined && (typeof value === 'object' || !keys.length)) {
        data = value;
        propKey = '';
      } else if (!keys.length) {
        data = key;
      } else {
        propKey += '.';
      }
    } while (keys.length);

    return data;
  }

  private setTranslation(lang: string, data: any): any {
    let finalResult = this.data[lang] || {};
    finalResult = this.merge(finalResult, data || {});
    this.data[lang] = finalResult;
    return finalResult;
  }

  private merge(...translations): any {
    const result = {};

    translations.forEach(translation => {
      Object.keys(translation).forEach(key => {
        if (key in result && Array.isArray(result[key])) {
          result[key] = result[key].concat(translation[key]);
        } else if (key in result && typeof result[key] === 'object') {
          result[key] = this.merge(result[key], translation[key]);
        } else {
          result[key] = translation[key];
        }
      });
    });

    return result;
  }

  private format(str: string, params: { [key: string]: string }): string {
    let result = str;

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        const template = new RegExp('{' + key + '}', 'gm');

        result = result.replace(template, value);
      });
    }

    return result;
  }
}
