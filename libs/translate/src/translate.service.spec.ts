import { TestBed, inject } from '@angular/core/testing';

import { TranslateService } from './translate.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

describe('TranslateService', () => {

  let translate: TranslateService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TranslateService]
    });

    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([TranslateService], (service: TranslateService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch and return translation data on use', async () => {
    const translation = { title: 'hello' };
    spyOn(http, 'get').and.returnValue(Observable.of(translation));

    const fetched = await translate.use('en');
    expect(fetched).toEqual(translation);
  });

  it('should return empty data on fetch error', async () => {
    spyOn(http, 'get').and.returnValue(Observable.throw('error'));

    const fetched = await translate.use('en');
    expect(fetched).toEqual({});
  });

  it('should fetch the language file from the correct folder', async () => {
    spyOn(http, 'get').and.returnValue(Observable.of({}));

    await translate.use('en');
    expect(http.get).toHaveBeenCalledWith('assets/i18n/en.json');
  });

  it('should fetch fallback language', async () => {
    spyOn(http, 'get').and.returnValue(Observable.of({}));

    await translate.use(null);
    expect(http.get).toHaveBeenCalledWith(`assets/i18n/${translate.fallbackLang}.json`);
  });

  it('should use custom data for a lang', async () => {
    const custom = { title: 'custom title' };
    spyOn(http, 'get').and.returnValue(Observable.of({}));

    const result = await translate.use('en', custom);

    expect(result).toEqual(custom);
    expect(http.get).not.toHaveBeenCalled();
    expect(translate.get('title', null, 'en')).toBe(custom.title);
  });

  it('should setup empty translation for missing data', async () => {
    spyOn(http, 'get').and.returnValue(Observable.of(null));
    const result = await translate.use('fr');
    expect(result).toEqual({});
  });

  it('should return existing data when fetching a lang', async () => {
    const custom = { title: 'custom title' };
    spyOn(http, 'get').and.returnValue(Observable.of({}));

    await translate.use('en', custom);
    const result = await translate.use('en');

    expect(result).toEqual(custom);
    expect(http.get).not.toHaveBeenCalled();
  });

  it('should have fallback lang defined by default', () => {
    expect(translate.fallbackLang).toBeDefined();
  });

  it('should have active lang defined by default', () => {
    expect(translate.activeLang).toBeDefined();
  });

  it('should have active lang set to fallback one by default', () => {
    expect(translate.activeLang).toBeDefined();
    expect(translate.activeLang).toEqual(translate.fallbackLang);
  });

  it('should get active lang translation', async () => {
    const data = { title: 'hello' };
    await translate.use('en', data);

    expect(translate.get('title')).toEqual('hello');
  });

  it('should get translation for the given language', async () => {
    const data_en = { title: 'hello' };
    const data_fr = { title: 'bonjour' };
    await translate.use('en', data_en);
    await translate.use('fr', data_fr);

    expect(translate.get('title', null, 'fr')).toEqual(data_fr.title);
  });

  it('should return key for missing translation', () => {
    expect(translate.get('KEY')).toBe('KEY');
  });

});
