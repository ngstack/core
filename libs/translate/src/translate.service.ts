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

  get(key: string, params?: { [key: string]: string }, lang?: string): string {
    if (key) {
      const translation = this.data[lang || this.activeLang];
      const value = this.getTranslationValue(translation, key);
      return this.format(value, params);
    } else {
      return null;
    }
  }

  use(lang: string, data?: any): Promise<any> {
    this._activeLang = lang || this._fallbackLang;

    if (lang && data) {
      return Promise.resolve(
        this.setTranslation(lang, data)
      );
    }

    const translation = this.data[lang];

    if (translation) {
      return Promise.resolve(translation);
    }

    return new Promise<any>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || this._fallbackLang}.json`;

      this.http.get<{}>(langPath).subscribe(
        json => {
          resolve(
            this.setTranslation(lang, json)
          );
        },
        error => {
          resolve(this.data[lang] || {});
        }
      );
    });
  }

  private getTranslationValue(data: any, key: string): string {
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
