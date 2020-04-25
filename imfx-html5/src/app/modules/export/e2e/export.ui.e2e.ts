import { browser, by, element, protractor } from 'protractor';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';
import { loginToApp } from '../../../tests/e2e/login-helper';

describe('(e2e) App Export(ui)', () => {

    beforeEach(() => {
        browser.get('./#/media');
    });

    function repetition() {
        let searchInput = browser.driver.findElement(by.css('.test-search-form-input'));
        searchInput.clear();

        browser.sleep(2000);

        searchInput.sendKeys('ix3');

        browser.sleep(1000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        let dropdown = browser.driver.findElement(by.css('.test-search-settings-li-dropdown'));
        browser.actions().mouseMove(dropdown).click().perform();

        browser.sleep(1000);

        let selectLi1 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(10)'));
        browser.actions().mouseMove(selectLi1).click().perform();
    };

    function checkFormat(numberInput) {
        browser.sleep(2000);

        let inputRadio = browser.driver.findElement(
            by.css(`.formats-wrapper div:nth-child(${numberInput}) input`));
        expect(inputRadio.isDisplayed()).toBe(true);
    }

    function checkCountPage(numberInput) {
        browser.sleep(2000);

        let inputRadio = browser.driver.findElement(
            by.css(`.formats-wrapper > p input:nth-child(${numberInput})`));
        expect(inputRadio.isDisplayed()).toBe(true);
    }

    it('(e2e) 0. Should get the login', function () {
        loginToApp();
    });

    it('(e2e) 1. Should get the radio button HTML', function () {
        repetition();

        checkFormat(1);
    });

    it('(e2e) 2. Should get the radio button Excel', function () {
        repetition();

        checkFormat(2);
    });

    it('(e2e) 3. Should get the radio button CSV', function () {
        repetition();

        checkFormat(3);
    });

    it('(e2e) 4. Should get the radio button All Pages', function () {
        repetition();

        checkCountPage(1);
    });

    it('(e2e) 5. Should get the radio button Current Page', function () {
        repetition();

        checkCountPage(4);
    });

    it('(e2e) 6. Should get the button Start', function () {
        repetition();

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        expect(btnStart.isDisplayed()).toBe(true);
    });

    it('(e2e) 7. Should get the button Download', function () {
        repetition();

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(2)'));
        expect(btnDownload.isDisplayed()).toBe(true);
    });

    it('(e2e) 8. Should get the button Back', function () {
        repetition();

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isDisplayed()).toBe(true);
    });

    it('(e2e) 9. Should get the result icon', function () {
        repetition();

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let iconResult = browser.driver.findElement(by.css('.result-wrapper .icon'));
        expect(iconResult.isDisplayed()).toBe(true);
    });

    it('(e2e) 10. Should get the first step when start and second step when end', function () {
        repetition();

        browser.sleep(2000);

        let firstStep = browser.driver.findElement(by.css('imfx-modal .first .step-circle'));
        expect(firstStep.getCssValue('border-color')).not.toEqual('rgb(140, 191, 69)');

        let secondStepBeforeClickStart = browser.driver.findElement(
            by.css('imfx-modal .third .step-circle'));
        expect(secondStepBeforeClickStart
            .getCssValue('border-color')).not.toEqual('rgb(140, 191, 69)');

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let secondStepAfterClickStart = browser.driver.findElement(
            by.css('imfx-modal .third .step-circle'));
        expect(secondStepBeforeClickStart.getCssValue('border-color')).toEqual('rgb(140, 191, 69)');

        let iconClose = browser.driver.findElement(
            by.css('imfx-modal .icon'));
        iconClose.click();

        browser.sleep(1000);

        logoutFromApp();
    });
});
