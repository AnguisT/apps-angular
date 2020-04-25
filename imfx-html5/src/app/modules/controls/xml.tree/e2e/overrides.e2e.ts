/**
 * Created by Pavel on 21.02.2017.
 */

// readmore there http://www.javascripttuts.com/e2e-testing-angular-2-zero-hero-final-part/
import { browser, by, element } from 'protractor';

describe('(e2e) App XML Overrides', () => {

  beforeEach(() => {
    browser.get('./#/system-config/xml');
  });

  // console.log('init override cases')
  xit('(e2e) Should work enum override', () => {
      let subject = browser.getTitle();
      let result  = 'i-mediaflex';
      // console.log('passed override cases')
      browser.wait(function() {
        expect(subject).toEqual(result);
        return true;
      }, 5000);
  });


});
