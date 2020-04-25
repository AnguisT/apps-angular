/**
 * Created by initr on 06.12.2016.
 */
// see http://stepansuvorov.com/blog/2014/02/angularjs-protractor/
// http://stackoverflow.com/questions/37809915/
// element-not-visible-error-not-able-to-click-an-element
import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../../../tests/e2e/login-helper';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';

describe('(e2e) App Login', () => {

    beforeEach(() => {
        browser.get('./#/login');
    });

    it('(e2e) Should get the existing form', function () {
        let form = browser.driver.findElement(by.css('.test-login-form'));
        expect(form.isDisplayed()).toBe(true);
        browser.sleep(1000);
    });

    it('(e2e) Should receive an existing input', function () {
        let login = browser.driver.findElement(by.id('login-username'));
        let password = browser.driver.findElement(by.id('login-password'));
        expect(login.isDisplayed()).toBe(true);
        expect(password.isDisplayed()).toBe(true);
        browser.sleep(1000);
    });

    it('(e2e) Should receive an existing button', function () {
        let btnLogin = browser.driver.findElement(by.id('login-submit'));
        expect(btnLogin.isDisplayed()).toBe(true);
        browser.sleep(1000);
    });

    xit('(e2e) Should receive an existing link', function () {
        let link = browser.driver.findElement(by.css('a'));
        expect(link.isDisplayed()).toBe(true);
        browser.sleep(1000);
    });

    it('(e2e) Should receive an existing dropdown', function () {
        let dropdown = browser.driver.findElement(by.css('.test-lang-switcher-dropdown'));
        expect(dropdown.isDisplayed()).toBe(true);
        browser.sleep(1000);
    });

    it('(e2e) Should receive two filled in entries and an activated button', function () {
        let username = browser.driver.findElement(by.id('login-username'));
        let password = browser.driver.findElement(by.id('login-password'));

        username.clear();
        password.clear();

        browser.sleep(2000);

        username.sendKeys('tmddba');
        password.sendKeys('*.tmd02');

        let button = browser.driver.findElement(by.id('login-submit'));
        expect(button.isEnabled()).toBe(true);

        browser.sleep(1000);
    });

    it('(e2e) Should receive filled input(username) and an disabled button', function () {
        let username = browser.driver.findElement(by.id('login-username'));
        let password = browser.driver.findElement(by.id('login-password'));

        username.clear();
        password.clear();

        browser.sleep(2000);

        username.sendKeys('tmddba');
        password.sendKeys('');

        let button = browser.driver.findElement(by.id('login-submit'));
        expect(button.isEnabled()).toBe(false);
        browser.sleep(1000);
    });

    it('(e2e) Should receive filled input(password) and an disabled button', function () {
        let username = browser.driver.findElement(by.id('login-username'));
        let password = browser.driver.findElement(by.id('login-password'));

        username.clear();
        password.clear();

        browser.sleep(2000);

        username.sendKeys('');
        password.sendKeys('*.tmd02');

        let button = browser.driver.findElement(by.id('login-submit'));
        expect(button.isEnabled()).toBe(false);
        browser.sleep(1000);
    });

    it('(e2e) Should receive two empty inputs and disabled button', function () {
        let username = browser.driver.findElement(by.id('login-username'));
        let password = browser.driver.findElement(by.id('login-password'));

        username.clear();
        password.clear();

        browser.sleep(2000);

        username.sendKeys('');
        password.sendKeys('');

        let newButton = browser.driver.findElement(by.id('login-submit'));
        expect(newButton.isEnabled()).toBe(false);
        browser.sleep(1000);
    });

    xit('(e2e) Should get the main page of the official site tmd', function() {
        let link = browser.driver.findElement(by.css('p a'));
        browser.actions().mouseMove(link).click().perform();
        browser.sleep(1000);
    });

    /// Switch languages
    function switcherLanguages(lang, result) {
        let classLang = '.test-lang-' + lang;
        let subject = browser.driver.findElement(by.css('.test-login-prompt'));
        let selector = browser.driver.findElement(by.css('.test-lang-switcher-dropdown'));

        browser.sleep(2000).then(() => {
            browser.actions().mouseMove(selector).click().perform();
        });

        browser.sleep(2000).then(() => {
            let elem = browser.driver.findElement(by.css(classLang));
            browser.actions().mouseMove(elem).click().perform();
        });

        browser.sleep(2000);

        expect(subject.getText()).toEqual(result);
    }

    it('(e2e) Should switch languages', function () {
        switcherLanguages('ru-RU', 'ВХОД В СИСТЕМУ');
        switcherLanguages('en-GB', 'PLEASE SIGN IN');
        switcherLanguages('en-AU', 'PLEASE SIGN IN');
        switcherLanguages('en-US', 'PLEASE SIGN IN');
    });

    it('(e2e) Should log in ', function() {
        // loginToApp();
        let username = 'tmddba';
        let password = '*.tmd02';
        let elUsername = browser.driver.findElement(by.id('login-username'));
        let elPassword = browser.driver.findElement(by.id('login-password'));
        let btn = browser.driver.findElement(by.id('login-submit'));

        elUsername.clear();
        elUsername.sendKeys(username);
        elPassword.clear();
        elPassword.sendKeys(password);

        browser.sleep(2000).then(() => {
            browser.actions().mouseMove(btn).click().perform();
        }).then(() => {
            let mainPage = browser.driver.findElement(by.css('.full-height-width-block'));
            expect(mainPage.isDisplayed()).toBe(true);
        });

        browser.sleep(2000);

        logoutFromApp();
    });
});
