/**
 * Created by initr on 06.12.2016.
 */
// readmore there http://www.javascripttuts.com/e2e-testing-angular-2-zero-hero-final-part/
import { browser, by, element } from 'protractor';
import { loginToApp } from './tests/e2e/login-helper';

xdescribe('(e2e) App', () => {

    beforeEach(() => {
        browser.get('./#/login');
    });

    // it('log in', () => {
    //     loginToApp();
    // });

    // it('should have a title', () => {
    //     let subject = browser.getTitle();
    //     let result  = 'IMFX TMD';
    //     expect(subject).toEqual(result);
    // });
    //
    // it('should have header', () => {
    //     let subject = element(by.css('h1')).isPresent();
    //     let result  = true;
    //     expect(subject).toEqual(result);
    // });
    //
    // it('should have <home>', () => {
    //     let subject = element(by.css('app home')).isPresent();
    //     let result  = true;
    //     expect(subject).toEqual(result);
    // });
    //
    // it('should have buttons', () => {
    //     let subject = element(by.css('button')).getText();
    //     let result  = 'Submit Value';
    //     expect(subject).toEqual(result);
    // });

});
