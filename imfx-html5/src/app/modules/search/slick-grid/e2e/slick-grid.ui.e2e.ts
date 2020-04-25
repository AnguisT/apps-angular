// 1.1 Should get the top-panel on wf search
// 1.2 Should get the body on media search
// 1.3. Should get the bottom-panel on media search
// 1.4. Should get the div with information about count found media items
// 1.5. Should get the div without information about count found media items
// 1.6. Should get the div with paging
// 1.7. Should get the div without paging

import { browser, by, element, protractor } from 'protractor';
import { logoutFromApp } from '../../../../tests/e2e/logout-helper';
import { loginToApp } from '../../../../tests/e2e/login-helper';

describe('(e2e) App Slick-grid(ui)', () => {

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
    }

    it('(e2e) 0. Should get the login', () => {
        loginToApp();
    });

    xit('(e2e) 1. Should get the top-panel on wf search', () => {
        let menu = browser.driver.findElement(
            by.xpath('//base-top-menu/ul/li[4]/a'));
        browser.actions().mouseMove(menu).click().perform();

        browser.sleep(1000);

        let selectedMenu = browser.driver.findElement(
            by.xpath('//base-top-menu/ul/li[4]/ul/li[1]/a'));
        browser.actions().mouseMove(selectedMenu).click().perform();

        browser.sleep(2000);

        repetition();

        browser.sleep(2000);

        let row = browser.driver.findElement(
            by.css('.slick-viewport-top .grid-canvas-right .slick-row:nth-child(2)'));
        browser.actions().keyDown(protractor.Key.CONTROL).perform();
        browser.actions().keyDown(protractor.Key.SHIFT).perform();
        browser.actions().mouseMove(row).click().perform();

        browser.sleep(1000);

        let topPanel = browser.driver.findElement(by.css('.slick-grid-top-panel'));
        expect(topPanel.isDisplayed()).toBe(true);
    });

    it('(e2e) 2. Should get the body on media search', () => {
        let bodyGrid = browser.driver.findElement(by.css('media .slick-grid-block-wrapper'));
        expect(bodyGrid.isDisplayed()).toBe(true);
    });

    it('(e2e) 3. Should get the bottom-panel on media search', () => {
        let bottomPanel = browser.driver.findElement(by.css('media .slick-grid-bottom-panel'));
        expect(bottomPanel.isDisplayed()).toBe(true);
    });

    it('(e2e) 4. Should get the div with information about count found media items', () => {
        browser.sleep(2000);

        repetition();

        browser.sleep(4000);

        let resultSearh = browser.driver.findElement(by.css('.wrapper-info'));
        expect(resultSearh.getText()).not.toEqual('');
    });

    it('(e2e) 5. Should get the div without information about count found media items', () => {
        let resultSearh = browser.driver.findElement(by.css('slickgrid-info-comp'));
        resultSearh.findElements(by.css('.wrapper-info')).then((value) => {
            expect(value).toEqual([]);
        });
        // expect(resultSearh.isDisplayed()).toBe(false);
    });

    it('(e2e) 6. Should get the div with paging', () => {
        repetition();

        let paging = browser.driver.findElement(by.css('slickgrid-pager-comp'));
        expect(paging.isDisplayed()).toBe(true);
    });

    it('(e2e) 7. Should get the div without paging', () => {
        let paging = browser.driver.findElement(by.css('slickgrid-pager-comp'));
        expect(paging.isDisplayed()).toBe(false);

        logoutFromApp();
    });
});
