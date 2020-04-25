/**
 * Created by dvvla on 21.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../app/tests/e2e/login-helper';
import { logoutFromApp } from '../app/tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) Media Search', () => {
    beforeEach(() => {
        browser.get('./#/media');
    });

    it('(e2e) Should get video information with Media search', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let inputSearch = browser.driver.findElement(
              by.css('.test-search-form-input'));
            inputSearch.clear();
            inputSearch.sendKeys('senate');

            browser.sleep(2000);

            let btnSearch = browser.driver.findElement(
              by.css('.test-search-form-btn'));
            btnSearch.click();

            browser.sleep(2000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();

            browser.sleep(2000);

            let selectParameter = browser.driver.findElement(
              by.css('advanced-criteria-field-builder span.select2'));
            browser.actions().mouseMove(selectParameter).click().perform();
            browser.sleep(2000);
            browser.actions().sendKeys('ID').perform();
            let selectLi1 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(2)'));
            browser.actions().mouseMove(selectLi1).click().perform();

            browser.sleep(2000);

            let inputData = browser.driver.findElement(
              by.css('advanced-criteria-control-numberbox input'));
            inputData.clear();

            browser.sleep(2000);

            inputData.sendKeys('66375');

            browser.sleep(2000);

            let btnThumbs = browser.driver.findElement(
              by.css('.test-button-thumbs'));
            btnThumbs.click();

            browser.sleep(2000);

            let settingsButton = browser.driver.findElement(
              by.css('.settingsButton .icon'));
            settingsButton.click();

            browser.sleep(2000);

            let selectSetting = browser.driver.findElement(
              by.css('.mediaSettingsPopup li:nth-child(2)'));
            selectSetting.click();
            // browser.actions().click(div).click(div).perform();
            // browser.actions().mouseMove(div).doubleClick().perform();
            // div.click();

            browser.sleep(10000);

            let btnPlay1 = browser.driver.findElement(
              by.css('html-player button.large'));
            browser.actions().mouseMove(btnPlay1).click().perform();

            browser.sleep(10000);

            let btnPlay2 = browser.driver.findElement(
              by.css('html-player .sub-control-bar:nth-child(1) div.icon-button:nth-child(1)'));
            browser.actions().mouseMove(btnPlay2).click().perform();

            let time = browser.driver.findElement(by.css('.currentTimecode'));
            expect(time.getText()).not.toBe('00:00:00:00');
        });
    });
});
