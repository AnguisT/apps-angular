/**
 * Created by dvvla on 24.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../../../tests/e2e/login-helper';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) App Media. Query by example(ui)', () => {

    beforeEach(() => {
        browser.get('./#/login');
        loginToApp();
    });

    afterEach(() => {
        logoutFromApp();
    });

    function repetition() {
        // loginToApp();

        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            browser.driver.findElement(
                by.css('.test-advanced-searching-button')).click();

            browser.sleep(1000);

            let btnQueryExample = browser.driver.findElement(by.css('.test-adv-qbe-btn'));
            btnQueryExample.click();
        });

        // browser.sleep(1000);

        // let advanceButton = browser.driver.findElement(
        //   by.css('.test-advanced-searching-button'));
        // advanceButton.click();

        // browser.sleep(1000);

        // let btnQueryExample = browser.driver.findElement(by.css('.test-adv-qbe-btn'));
        // btnQueryExample.click();
    };

    it('(e2e) Should get the button Query by example', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
                by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let btnQueryExample = browser.driver.findElement(by.css('.test-adv-qbe-btn'));
            expect(btnQueryExample.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the div advanced search', () => {
        repetition();

        let searchBlock = browser.driver.findElement(
          by.css('.test-advanced-searching-div-advanced-search-block'));
        expect(searchBlock.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the div advanced-group', () => {
        repetition();

        let advancedGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-div-advanced-group'));
        expect(advancedGroup.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the select for network (A)', () => {
        repetition();

        browser.sleep(1000);

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2'));
        expect(selectParameter.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the input for date from (A)', () => {
        repetition();

        let inputAbsoluteDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) input'));
        expect(inputAbsoluteDateFrom.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the input for date to (A)', () => {
        repetition();

        let inputAbsoluteDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) input'));
        expect(inputAbsoluteDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button for transition between Absolute ' +
        'or Relative time for date from', () => {
        repetition();

        let buttonDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) button'));
        expect(buttonDateFrom.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button for transition between Absolute ' +
        'or Relative time for date to', () => {
        repetition();

        let buttonDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) button'));
        expect(buttonDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the select for date from, that choose type data(hours, days) (R)', () => {
        repetition();

        let buttonDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) button'));
        buttonDateFrom.click();

        let selectRelativeDateFrom = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime select'));
        expect(selectRelativeDateFrom.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the select for date to, that choose type data(hours, days) (R)', () => {
        repetition();

        let buttonDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) button'));
        buttonDateTo.click();

        let selectRelativeDateTo = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime select'));
        expect(selectRelativeDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the input for enter number for date from (R)', () => {
        repetition();

        let buttonDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) button'));
        buttonDateFrom.click();

        let inputRelativeDateFrom = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime input'));
        expect(inputRelativeDateFrom.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the input for enter number for date to (R)', () => {
        repetition();

        let buttonDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) button'));
        buttonDateTo.click();

        let inputRelativeDateTo = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime input'));
        expect(inputRelativeDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the date from (A) and date to (A)', () => {
        repetition();

        // Absolute date from
        let inputAbsoluteDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) input'));
        expect(inputAbsoluteDateFrom.isDisplayed()).toBe(true);

        // Absolute date to
        let inputAbsoluteDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) input'));
        expect(inputAbsoluteDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the date from (A) and date to (R)', () => {
        repetition();

        // Absolute date from
        let inputAbsoluteDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) input'));
        expect(inputAbsoluteDateFrom.isDisplayed()).toBe(true);

        // Relative date to
        let buttonDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) button'));
        buttonDateTo.click();

        let selectRelativeDateTo = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime select'));
        expect(selectRelativeDateTo.isDisplayed()).toBe(true);

        let inputRelativeDateTo = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime input'));
        expect(inputRelativeDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the date from (R) and date to (A)', () => {
        repetition();

        // Relative date from
        let buttonDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) button'));
        buttonDateFrom.click();

        let selectRelativeDateFrom = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime select'));
        expect(selectRelativeDateFrom.isDisplayed()).toBe(true);

        let inputRelativeDateFrom = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime input'));
        expect(inputRelativeDateFrom.isDisplayed()).toBe(true);

        // Absolute date to
        let inputAbsoluteDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) input'));
        expect(inputAbsoluteDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the date from (R) and date to (R)', () => {
        repetition();

        // Relative date from
        let buttonDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) button'));
        buttonDateFrom.click();

        let selectRelativeDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) .select2'));
        expect(selectRelativeDateFrom.isDisplayed()).toBe(true);

        let inputRelativeDateFrom = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(2) input'));
        expect(inputRelativeDateFrom.isDisplayed()).toBe(true);

        // Relative date to
        let buttonDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) button'));
        buttonDateTo.click();

        let selectRelativeDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) .select2'));
        expect(selectRelativeDateTo.isDisplayed()).toBe(true);

        let inputRelativeDateTo = browser.driver.findElement(
          by.css('.criteria-group-item:nth-child(3) input'));
        expect(inputRelativeDateTo.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the checkbox for Closed Caption', () => {
        repetition();

        let closedCaption = browser.driver.findElement(
          by.css('advanced-criteria-control-checkbox input'));
        expect(closedCaption.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button clear', () => {
        repetition();

        let btnClear = browser.driver.findElement(
          by.css('.test-advanced-searching-button-clear'));
        expect(btnClear.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });
});
