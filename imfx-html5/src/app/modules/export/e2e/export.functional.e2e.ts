import { browser, by, element, protractor } from 'protractor';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';
import { loginToApp } from '../../../tests/e2e/login-helper';

describe('(e2e) App Export(functional)', () => {

    beforeEach(() => {
        browser.get('./#/media');
    });

    function repetitionWithSearch() {
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

    function repetitionWithoutSearch() {
        let dropdown = browser.driver.findElement(by.css('.test-search-settings-li-dropdown'));
        browser.actions().mouseMove(dropdown).click().perform();

        browser.sleep(1000);

        let selectLi1 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(10)'));
        browser.actions().mouseMove(selectLi1).click().perform();
    };

    function selectFormat(numberInput) {
        browser.sleep(2000);

        let inputRadio = browser.driver.findElement(
            by.css(`.formats-wrapper div:nth-child(${numberInput}) input`));
        inputRadio.click();

        expect(inputRadio.isSelected()).toBe(true);
    }

    function selectCountPage(numberInput) {
        browser.sleep(2000);

        let inputRadio = browser.driver.findElement(
            by.css(`.formats-wrapper > p input:nth-child(${numberInput})`));
        inputRadio.click();

        expect(inputRadio.isSelected()).toBe(true);
    }

    it('(e2e) 0. Should get the login', () => {
        loginToApp();
    });

    it('(e2e) 1. Should get the select radio button HTML', () => {
        repetitionWithSearch();

        selectFormat(1);
    });

    it('(e2e) 2. Should get the select radio button Excel', () => {
        repetitionWithSearch();

        selectFormat(2);
    });

    it('(e2e) 3. Should get the select radio button CSV', () => {
        repetitionWithSearch();

        selectFormat(3);
    });

    it('(e2e) 4. Should get the select radio button All Pages', () => {
        repetitionWithSearch();

        selectCountPage(1);
    });

    it('(e2e) 5. Should get the select radio button Current Page', () => {
        repetitionWithSearch();

        selectCountPage(4);
    });

    it('(e2e) 6. Should get the enable download button for HTML format and all pages', () => {
        repetitionWithSearch();

        selectFormat(1);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(4000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button.primary'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 7. Should get the enable download button for Excel format and all pages', () => {
        repetitionWithSearch();

        selectFormat(2);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 8. Should get the enable download button for CSV format and all pages', () => {
        repetitionWithSearch();

        selectFormat(3);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 9. Should get the enable download button for HTML format and current pages', () => {
        repetitionWithSearch();

        selectFormat(1);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 10. Should get the enable download button for Excel format and current pages', () => {
        repetitionWithSearch();

        selectFormat(2);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 11. Should get the enable download button for CSV format and current pages', () => {
        repetitionWithSearch();

        selectFormat(3);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let btnDownload = browser.driver.findElement(by.css('imfx-modal button:nth-child(1)'));
        expect(btnDownload.isEnabled()).toBe(true);
    });

    it('(e2e) 12. Should get the error mesage for HTML format and all pages', () => {
        repetitionWithoutSearch();

        selectFormat(1);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);
    });

    it('(e2e) 13. Should get the error mesage for Excel format and all pages', () => {
        repetitionWithoutSearch();

        selectFormat(2);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);
    });

    it('(e2e) 14. Should get the error mesage for CSV format and all pages', () => {
        repetitionWithoutSearch();

        selectFormat(3);

        browser.sleep(2000);

        selectCountPage(1);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);
    });

    it('(e2e) 15. Should get the error mesage for HTML format and current pages', () => {
        repetitionWithoutSearch();

        selectFormat(1);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);
    });

    it('(e2e) 16. Should get the error mesage for Excel format and current pages', () => {
        repetitionWithoutSearch();

        selectFormat(2);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);
    });

    it('(e2e) 17. Should get the error mesage for CSV format and current pages', () => {
        repetitionWithoutSearch();

        selectFormat(3);

        browser.sleep(2000);

        selectCountPage(4);

        browser.sleep(2000);

        let btnStart = browser.driver.findElement(by.css('imfx-modal button'));
        btnStart.click();

        browser.sleep(2000);

        let errorMessage = browser.driver.findElement(by.css('imfx-modal .notification'));
        expect(errorMessage.isDisplayed()).toBe(true);

        let iconClose = browser.driver.findElement(
            by.css('imfx-modal .icon'));
        iconClose.click();

        browser.sleep(2000);

        logoutFromApp();
    });
});
