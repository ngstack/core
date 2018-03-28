import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';
import { HttpClientModule } from '@angular/common/http';

describe('TranslatePipe', () => {

  let translate: TranslateService;
  let pipe: TranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TranslateService]
    });

    translate = TestBed.get(TranslateService);
    pipe = new TranslatePipe(translate);
  });

  it('should use translate service to transform value', () => {
    spyOn(translate, 'get').and.returnValue('bonjour');

    const result = pipe.transform('hello');
    expect(result).toEqual('bonjour');
  });
});
