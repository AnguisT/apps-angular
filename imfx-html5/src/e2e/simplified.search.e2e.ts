/**
 * Created by dvvla on 21.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../app/tests/e2e/login-helper';
import { logoutFromApp } from '../app/tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) Simplified search', () => {
    beforeEach(() => {
        browser.get('./#/media');
    });

    it('(e2e) Should get video information using a Simplified search', () => {
        let topMenu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/a'));
        browser.actions().mouseMove(topMenu).click().perform();

        let topMenuItem = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/ul/li[5]/a'));
        topMenuItem.click();

        browser.sleep(2000);

        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        let title = browser.driver.findElement(
          by.css('.simplified-item__row:nth-child(9) .item-title'));
        browser.actions().mouseMove(title).click().perform();

        browser.sleep(10000);

        // let simplifiedDetail = browser.driver.findElement(
        //   by.css('.simplified-detail'));
        // expect(simplifiedDetail.isDisplayed()).toBe(true);
		//
        // browser.sleep(2000);

        let btnPlay1 = browser.driver.findElement(
          by.css('html-player button.large'));
        browser.actions().mouseMove(btnPlay1).click().perform();

        browser.sleep(1000);

        let btnFullscreen = browser.driver.findElement(
          by.css('html-player .sub-control-bar:nth-child(3) div.icon-button:nth-child(3)'));
        browser.actions().mouseMove(btnFullscreen).click().perform();

        browser.sleep(1000);

        browser.actions().mouseMove(btnFullscreen).click().perform();

        browser.sleep(1000);

        let btnPlay2 = browser.driver.findElement(
          by.css('html-player .sub-control-bar:nth-child(1) div.icon-button:nth-child(1)'));
        browser.actions().mouseMove(btnPlay2).click().perform();

        let time = browser.driver.findElement(by.css('.currentTimecode'));
        expect(time.getText()).not.toBe('00:00:00:00');
    });
});
