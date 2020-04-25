/**
 * Created by dvvla on 24.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../../../tests/e2e/login-helper';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) App Media. Query builder(functional)', () => {
    beforeEach(() => {
        browser.get('./#/login');
    });

    afterAll(() => {
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

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();
        });
    }

    it('(e2e) Shuold get the login', () => {
        loginToApp();
    });

    it('(e2e) Should get the visibility(save button), ' +
        'when the saved search is selected', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(1000);

            let btnSelectSaved = browser.driver.findElement(
              by.css('#selectSavedSearch span.select2'));
            browser.actions().mouseMove(btnSelectSaved).click().perform();

            browser.sleep(1000);

            let selectLi = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi).click().perform();

            let btnSaveSearch = browser.driver.findElement(
              by.css('.test-advanced-searching-button-save-builder'));
            expect(btnSaveSearch.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the added group, after click button Add Group', () => {
        repetition();

        browser.sleep(1000);

        let divGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-div-advanced-group'));
        expect(divGroup.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the added criteria, after click button Add Criteria', () => {
        repetition();

        browser.sleep(1000);

        let btnAddCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-criteria-builder'));
        btnAddCriteria.click();

        let divCriteria = browser.driver.findElement(by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the visibility(save button), when added new group', () => {
        repetition();

        browser.sleep(1000);

        let btnSaveSearch = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        expect(btnSaveSearch.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the one criteria, ' +
        'after click button remove one of the two criteria', () => {
        let count = 0;

        repetition();

        count++;

        browser.sleep(1000);

        let btnAddCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-criteria-builder'));
        btnAddCriteria.click();
        count++;

        browser.sleep(1000);

        let divCriteria1 = browser.driver.findElement(
          by.css('div.criteria-group-item:nth-child(1)'));
        expect(divCriteria1.isDisplayed()).toBe(true);

        let divCriteria2 = browser.driver.findElement(
          by.css('div.criteria-group-item:nth-child(2)'));
        expect(divCriteria2.isDisplayed()).toBe(true);

        let btnRemoveCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item:nth-child(2) ' +
            '.test-advanced-searching-button-remove-criteria-builder'));
        btnRemoveCriteria.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(1);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the empty advanced group and disable(search button), ' +
        'after click button remove one criteria', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(1000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let criteriaInput = browser.driver.findElement(
          by.css('.criteria-group-item input.field'));
        criteriaInput.clear();

        browser.sleep(1000);

        criteriaInput.sendKeys(1);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        expect(btnSearch.isEnabled()).toBe(true);

        let btnRemoveCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-criteria-builder'));
        btnRemoveCriteria.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);
        expect(btnSearch.isEnabled()).toBe(false);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the one group, ' +
        'after click button remove one of the two group', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(1000);

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();
        count++;

        expect(count).toBe(2);

        browser.sleep(1000);

        let divGroup1 = browser.driver.findElement(
          by.css('div.criteria-group:nth-child(1)'));
        expect(divGroup1.isDisplayed()).toBe(true);

        let divGroup2 = browser.driver.findElement(
          by.css('div.criteria-group:nth-child(2)'));
        expect(divGroup2.isDisplayed()).toBe(true);

        let btnRemoveGroup = browser.driver.findElement(
          by.css('div.criteria-group:nth-child(2) ' +
            '.test-advanced-searching-button-remove-group-builder'));
        btnRemoveGroup.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(1);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the empty advanced group and disable(search button), ' +
        'after click button remove one group', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(1000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let criteriaInput = browser.driver.findElement(
          by.css('.criteria-group-item input.field'));
        criteriaInput.clear();

        browser.sleep(1000);

        criteriaInput.sendKeys(1);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        expect(btnSearch.isEnabled()).toBe(true);

        let btnRemoveGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-group-builder'));
        btnRemoveGroup.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);
        expect(btnSearch.isEnabled()).toBe(false);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the empty advanced group and disable(search button), ' +
        'after click button clear', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(2000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        // let criteriaInput = browser.driver.findElement(
        //   by.css('.criteria-group-item input.field'));
        // criteriaInput.clear();
		//
        // browser.sleep(2000);
		//
        // criteriaInput.sendKeys(1);
		//
        // browser.sleep(2000);
		//
        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        // expect(btnSearch.isEnabled()).toBe(true);
		//
        // browser.sleep(2000);
		//
        // criteriaInput.clear();
		//
        // browser.sleep(2000);

        let btnClear = browser.driver.findElement(
          by.css('.test-advanced-searching-button-clear'));
        btnClear.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);
        expect(btnSearch.isEnabled()).toBe(false);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the removed(button save), after click button clear', () => {
        let count = 0;

        repetition();

        count++;

        let btnSave = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        expect(btnSave.isDisplayed()).toBe(true);

        expect(count).toBe(1);

        browser.sleep(1000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let btnClear = browser.driver.findElement(
          by.css('.test-advanced-searching-button-clear'));
        btnClear.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the invisibility button save, ' +
        'after click button remove criteria', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(1000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let btnSave = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        expect(btnSave.isDisplayed()).toBe(true);

        let btnRemoveCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-criteria-builder'));
        btnRemoveCriteria.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the invisibility button save, ' +
        'after click button remove group', () => {
        let count = 0;

        repetition();

        count++;

        expect(count).toBe(1);

        browser.sleep(1000);

        let divCriteria = browser.driver.findElement(
          by.css('div.criteria-group-item'));
        expect(divCriteria.isDisplayed()).toBe(true);

        let btnSave = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        expect(btnSave.isDisplayed()).toBe(true);

        let btnRemoveGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-group-builder'));
        btnRemoveGroup.click();
        count--;

        browser.sleep(1000);

        expect(count).toBe(0);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the saved search', () => {
        repetition();

        browser.sleep(2000);

        let btnSave = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        btnSave.click();

        browser.sleep(1500);

        let inputSaveModal = browser.driver.findElement(by.id('modalPromptInput'));
        inputSaveModal.sendKeys('MYTEST');

        browser.sleep(1500);

        let btnSaveModal = browser.driver.findElement(
          by.css('imfx-modal button.primary'));
        btnSaveModal.click();

        browser.actions().sendKeys('MYTEST').perform();
        browser.actions().sendKeys(protractor.Key.ENTER);

        browser.sleep(1500);

        let selectSavedSearch = browser.driver.findElement(
          by.css('#selectSavedSearch span.select2-selection__rendered'));
        expect(selectSavedSearch.getText()).toBe('MYTEST');

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the removed saved search, ' +
        'after selecting a saved search and click remove button', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(1000);

            let selectSavedSearch = browser.driver.findElement(
              by.css('#selectSavedSearch span.select2'));
            browser.actions().mouseMove(selectSavedSearch).click().perform();

            browser.sleep(1000);

            browser.actions().sendKeys('MYTEST').perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
            browser.sleep(2000);
            // browser.actions().mouseMove(selectSavedSearch, {x: -1000, y: -1000}).click().perform();

            let divGroup = browser.driver.findElement(
              by.css('div.criteria-group'));
            expect(divGroup.isDisplayed()).toBe(true);

            let btnRemoveSavedSearch = browser.driver.findElement(
              by.css('.test-advanced-searching-button-remove-builder'));
            expect(btnRemoveSavedSearch.isDisplayed()).toBe(true);
            browser.actions().mouseMove(btnRemoveSavedSearch).click().perform();

            browser.sleep(2000);

            let btnYes = browser.driver.findElement(
              by.css('imfx-modal button.primary'));
            browser.actions().mouseMove(btnYes).click().perform();

            browser.sleep(2000);

            advanceButton.click();
        });
    });

    it('(e2e) Should get a new, not saved search,' +
        ' where the groups stayed from the last test', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let selectSavedSearch = browser.driver.findElement(
              by.css('#selectSavedSearch span.select2'));
            browser.actions().mouseMove(selectSavedSearch).click().perform();

            browser.sleep(1000);

            let selectLi = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi).click().perform();
            browser.actions().mouseMove(selectSavedSearch, {x: 1000, y: 0}).click().perform();

            let divGroup = browser.driver.findElement(
              by.css('div.criteria-group'));
            expect(divGroup.isDisplayed()).toBe(true);

            browser.sleep(2000);

            let btnNew = browser.driver.findElement(
              by.css('.test-advanced-searching-button-new-builder'));
            btnNew.click();

            browser.sleep(1000);

            expect(divGroup.isDisplayed()).toBe(true);

            expect(selectSavedSearch.getText()).toBe('Saved searches');

            advanceButton.click();
        });
    });

    function selectParameterMouse(result, option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            let selectLi = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(' + option + ')'));
            expect(selectLi.getText()).toBe(result);
            browser.actions().mouseMove(selectLi).click().perform();
        });

        let spanText = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2-selection__rendered'));
        expect(spanText.getText()).toBe(result);
    }

    // Select parameter
    it('(e2e) Should get the selecting parameter', () => {
        repetition();

        selectParameterMouse('Access Status', 1);
        selectParameterMouse('Active Format Description', 2);
        selectParameterMouse('Agency', 3);
        selectParameterMouse('Agency Number', 4);
        selectParameterMouse('Archive Category', 5);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    function selectParameterKeyboard(result) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();
        browser.sleep(1000);
        let inputSelectParameter = browser.driver.findElement(
          by.css('.select2-container--open .select2-search__field'));
        inputSelectParameter.clear();

        browser.sleep(1000).then(() => {
            inputSelectParameter.sendKeys(result);
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        let spanText = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2-selection__rendered'));
        expect(spanText.getText()).toBe(result);
    }

    // Enter parameter
    it('(e2e) Should get the enter parameter', () => {
        repetition();

        selectParameterKeyboard('Access Status');
        selectParameterKeyboard('Active Format Description');
        selectParameterKeyboard('Agency');
        selectParameterKeyboard('Agency Number');
        selectParameterKeyboard('Archive Category');

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    function searchData1() {
        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-control-textbox input'));
        // browser.actions().mouseMove(inputData).click().perform();
        inputData.clear();
        inputData.sendKeys('active');

        inputData.getAttribute('value').then(function(value) {
            expect(value).toBe('active');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function searchData2() {
        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-control-combomulti input'));
        inputData.click();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        expect(selectLi1.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi1).click().perform();

        let choise1 = browser.driver.findElement(
          by.css('li.select2-selection__choice:nth-child(1)'));

        expect(choise1.isDisplayed()).toBe(true);

        browser.sleep(2000);

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        expect(selectLi2.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi2).click().perform();

        let choise2 = browser.driver.findElement(
          by.css('li.select2-selection__choice:nth-child(2)'));

        expect(choise2.isDisplayed()).toBe(true);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function searchData2_1() {
        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-controls-container input'));
        inputData.click();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        expect(selectLi1.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi1).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        expect(selectLi2.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi2).click().perform();

        browser.sleep(1000);

        // browser.actions().mouseMove(inputData, {x: 10000, y: 10000}).click().perform();
    };
    function searchData3() {
        let checkboxData = browser.driver.findElement(
          by.css('advanced-criteria-control-checkbox input'));
        expect(checkboxData.isDisplayed()).toBe(true);
        checkboxData.click();

        checkboxData.getAttribute('value').then(function(value) {
            expect(value).toBe('on');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(1000);

        checkboxData.click();

        checkboxData.getAttribute('value').then(function(value) {
            expect(value).toBe('on');
        });

        btnSearch.click();

        browser.sleep(2000);

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function searchData4() {
        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-controls-container input'));
        // browser.actions().mouseMove(inputData).click().perform();
        inputData.clear();
        inputData.sendKeys('film');

        inputData.getAttribute('value').then(function(value) {
            expect(value).toBe('film');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function searchData5() {
        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-controls-container input'));
        // browser.actions().mouseMove(inputData).click().perform();
        inputData.clear();
        inputData.sendKeys('code');

        inputData.getAttribute('value').then(function(value) {
            expect(value).toBe('code');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function searchData6(type) {
        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let inputAbsoluteDate = browser.driver.findElement(
          by.css('imfx-controls-datetimepicker input'));
        browser.actions().mouseMove(inputAbsoluteDate).click().perform();
        inputAbsoluteDate.clear();

        browser.sleep(2000);

        inputAbsoluteDate.sendKeys('12.12.201712:00');
        inputAbsoluteDate.click();

        // let selectDate = browser.driver.findElement(
        //   by.css('.xdsoft_calendar tbody tr:nth-child(1) td:nth-child(1)'));
        // browser.actions().mouseMove(selectDate).click().perform();

        // inputAbsoluteDate.getAttribute('value').then(function (value) {
        //     expect(value).not.toBe('');
        // });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(2000);

        // let recentSearch1 = browser.driver.findElement(
        //   by.css('.recents.searches div:nth-child(1) label'));
        // if (type === '=') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date = 12.12.2017 09:00; ): 0 items');
        // } else if (type === '<=') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date <= 12.12.2017 09:00; ): 39 items');
        // } else if (type === '>=') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date >= 12.12.2017 09:00; ): 0 items');
        // } else if (type === '!=') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date != 12.12.2017 09:00; ): 39 items');
        // } else if (type === '>') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date > 12.12.2017 09:00; ): 0 items');
        // } else if (type === '<') {
        //     expect(recentSearch1.getText()).toBe('ix3 (Created Date < 12.12.2017 09:00; ): 39 items');
        // }

        let buttonDateFrom = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime button'));
        browser.actions().mouseMove(buttonDateFrom).click().perform();

        let selectRelativeDate = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime span.select2-selection__rendered'));
        browser.actions().mouseMove(selectRelativeDate).click().perform();

        browser.sleep(1000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        let inputRelativeDate = browser.driver.findElement(
          by.css('div:nth-child(2) advanced-criteria-control-singledatetime input'));
        browser.actions().mouseMove(inputRelativeDate).click().perform();

        inputRelativeDate.clear();
        inputRelativeDate.sendKeys('5');

        // inputRelativeDate.getAttribute('value').then(function (value) {
        //     expect(value).toBe('5');
        // });

        btnSearch.click();

        browser.sleep(2000);

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(2000);

        // let recentSearch2 = browser.driver.findElement(
        //   by.css('.recents.searches div:nth-child(1) label'));
        // if (type === '=') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date = 5 Days; ): 0 items');
        // } else if (type === '<=') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date <= 5 Days; ): 39 items');
        // } else if (type === '>=') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date >= 5 Days; ): 0 items');
        // } else if (type === '!=') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date != 5 Days; ): 39 items');
        // } else if (type === '>') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date > 5 Days; ): 0 items');
        // } else if (type === '<') {
        //     expect(recentSearch2.getText()).toBe('ix3 (Created Date < 5 Days; ): 39 items');
        // }

        browser.sleep(1000);

        browser.actions().mouseMove(selectRelativeDate).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi2).click().perform();

        inputRelativeDate.clear();
        inputRelativeDate.sendKeys('5');

        // inputRelativeDate.getAttribute('value').then(function (value) {
        //     expect(value).toBe('5');
        // });

        btnSearch.click();

        browser.sleep(2000);

        // let div3 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows3 = div3.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(2000);

        // let recentSearch3 = browser.driver.findElement(
        //   by.css('.recents.searches div:nth-child(1) label'));
        // if (type === '=') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date = 5 Hours; ): 0 items');
        // } else if (type === '<=') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date <= 5 Hours; ): 39 items');
        // } else if (type === '>=') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date >= 5 Hours; ): 0 items');
        // } else if (type === '!=') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date != 5 Hours; ): 39 items');
        // } else if (type === '>') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date > 5 Hours; ): 0 items');
        // } else if (type === '<') {
        //     expect(recentSearch3.getText()).toBe('ix3 (Created Date < 5 Hours; ): 39 items');
        // }

        buttonDateFrom.click();
    };

    function selectTypeCondition1(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 100000, y: 100000}).click().perform();

        browser.sleep(1000);

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        browser.sleep(1000);

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('Like');

        searchData1();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');

        searchData1();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi3 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi3).click().perform();
        expect(spanTypeCondition.getText()).toBe('!=');

        searchData1();
    };
    function selectTypeCondition2(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');
        browser.actions().mouseMove(selectTypeCondition, {x: 100000, y: 100000}).click().perform();

        browser.sleep(1000);

        searchData2();
        searchData2_1();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(spanTypeCondition.getText()).toBe('!=');
        browser.actions().mouseMove(selectTypeCondition, {x: 100000, y: 100000}).click().perform();

        browser.sleep(1000);

        searchData2();
        searchData2_1();
    };
    function selectTypeCondition3(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        // browser.actions().mouseMove(selectParameter, {x: 100000, y: 100000}).click().perform();

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');

        searchData3();
    };
    function selectTypeCondition4(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 100000, y: 100000}).click().perform();

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(4)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('Contains');
        searchData4();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(spanTypeCondition.getText()).toBe('About');
        searchData4();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi3 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(5)'));
        browser.actions().mouseMove(selectLi3).click().perform();
        expect(spanTypeCondition.getText()).toBe('Sounds Like');
        searchData4();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi4 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi4).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');
        searchData4();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi5 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi5).click().perform();
        expect(spanTypeCondition.getText()).toBe('!=');
        searchData4();
    };
    function selectTypeCondition5(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 100000, y: 100000}).click().perform();

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');
        searchData5();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(spanTypeCondition.getText()).toBe('!=');
        searchData5();

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi3 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi3).click().perform();
        expect(spanTypeCondition.getText()).toBe('Contains');
        searchData5();
    };
    function selectTypeCondition6(option) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(option).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 100000, y: 100000}).click().perform();

        browser.sleep(2000);

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let spanTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2-selection__rendered'));

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(4)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(spanTypeCondition.getText()).toBe('=');

        searchData6('=');

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(6)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(spanTypeCondition.getText()).toBe('>=');

        searchData6('>=');

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi3 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi3).click().perform();
        expect(spanTypeCondition.getText()).toBe('<='); // !

        searchData6('<=');

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi4 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi4).click().perform();
        expect(spanTypeCondition.getText()).toBe('!='); // !

        searchData6('!=');

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi5 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(5)'));
        browser.actions().mouseMove(selectLi5).click().perform();
        expect(spanTypeCondition.getText()).toBe('>');

        searchData6('>');

        browser.actions().mouseMove(selectTypeCondition).click().perform();

        let selectLi6 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi6).click().perform();
        expect(spanTypeCondition.getText()).toBe('<'); // !

        searchData6('<');
    };

    it('(e2e) Should get the type condition for selecting parameter', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let searchString = 'ix3';
            let searchInput = browser.driver.findElement(by.css('.test-search-form-input'));
            searchInput.clear();

            browser.sleep(2000);

            searchInput.sendKeys(searchString);

            browser.sleep(1000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();

            selectTypeCondition1('Access Status');
            selectTypeCondition2('Active Format Description');
            selectTypeCondition3('Closed Captions');
            selectTypeCondition4('Attachment');
            selectTypeCondition5('Comm. Code');
            selectTypeCondition6('Created Date');

            advanceButton.click();
        });
    });

    function enterData1(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-controls-container input'));
        browser.actions().mouseMove(inputData).click().perform();
        inputData.clear();
        inputData.sendKeys('active');

        inputData.getAttribute('value').then(function(value) {
            expect(value).toBe('active');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function enterData2(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-controls-container input'));
        inputData.click();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        expect(selectLi1.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi1).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        expect(selectLi2.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi2).click().perform();

        let choise1 = browser.driver.findElement(
          by.css('li.select2-selection__choice:nth-child(1)'));
        let choise2 = browser.driver.findElement(
          by.css('li.select2-selection__choice:nth-child(2)'));

        expect(choise1.isDisplayed()).toBe(true);
        expect(choise2.isDisplayed()).toBe(true);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function enterData3(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let inputData = browser.driver.findElement(
          by.css('advanced-criteria-control-xml button.sid'));
        inputData.click();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('advanced-criteria-control-xml .ag-body-container .ag-row:nth-child(2)'));
        expect(selectLi1.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi1).click().perform();

        browser.sleep(2000);

        let textData = browser.driver.findElement(
          by.css('advanced-criteria-control-xml button.sid span'));
        expect(textData.getText()).toBe('BBS_Delivery');

        inputData.click();

        browser.sleep(2000);

        let inputXML = browser.driver.findElement(
          by.css('advanced-criteria-control-xml input'));
        inputXML.sendKeys('BBS Delivery');

        let selectLi2 = browser.driver.findElement(
          by.css('advanced-criteria-control-xml .ag-body-container .ag-row:nth-child(1)'));
        expect(selectLi2.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi2).click().perform();

        browser.sleep(2000);

        expect(textData.getText()).toBe('BBS_Delivery');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     }
        // });
    }
    function enterData4(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let checkboxData = browser.driver.findElement(
          by.css('advanced-criteria-control-checkbox input'));
        expect(checkboxData.isDisplayed()).toBe(true);
        checkboxData.click();

        checkboxData.getAttribute('value').then(function(value) {
            expect(value).toBe('on');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(1000);

        checkboxData.click();

        checkboxData.getAttribute('value').then(function(value) {
            expect(value).toBe('on');
        });

        btnSearch.click();

        browser.sleep(2000);

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function enterData5(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let selectData = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2-selection__rendered'));
        expect(selectData.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectData).click().perform();

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(selectData.getText()).toBe('16:9');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        selectData.click();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi2).click().perform();
        expect(selectData.getText()).toBe('4:3');

        btnSearch.click();

        browser.sleep(2000);

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        selectData.click();

        let selectLi3 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi3).click().perform();
        expect(selectData.getText()).toBe('unknown');

        btnSearch.click();

        browser.sleep(2000);

        // let div3 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows3 = div3.findElements(by.css('.slick-row')).then(function(value) {
        //   let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function enterData6(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform()

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let inputAbsoluteDate = browser.driver.findElement(
          by.css('imfx-controls-datetimepicker input'));
        browser.sleep(1000);

        inputAbsoluteDate.click();

        browser.sleep(2000);

        browser.driver.findElement(
          by.css('.xdsoft_datetimepicker:nth-child(13) tr:nth-child(2) .xdsoft_day_of_week0')).click();

        inputAbsoluteDate.getAttribute('value').then(function (value) {
            expect(value).not.toBe('');
        });

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        let buttonDate = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime button'));
        buttonDate.click();

        let selectRelativeDate = browser.driver.findElement(
          by.css('advanced-criteria-control-singledatetime span.select2-selection__rendered'));
        selectRelativeDate.click();

        browser.sleep(1000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        let inputRelativeDate = browser.driver.findElement(
          by.css('div:nth-child(2) advanced-criteria-control-singledatetime input'));

        inputRelativeDate.clear();
        inputRelativeDate.sendKeys('5');

        inputRelativeDate.getAttribute('value').then(function (value) {
            expect(value).toBe('5');
        });

        btnSearch.click();

        browser.sleep(2000);

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(1000);

        selectRelativeDate.click();

        let selectLi2 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi2).click().perform();

        inputRelativeDate.clear();
        inputRelativeDate.sendKeys('5');

        inputRelativeDate.getAttribute('value').then(function (value) {
            expect(value).toBe('5');
        });

        btnSearch.click();

        browser.sleep(2000);

        // let div3 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows3 = div3.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });
    };
    function enterData7(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let customMetadata = browser.driver.findElement(
          by.css('advanced-criteria-control-xml button.sidx'));
        customMetadata.click();

        browser.sleep(1000);

        let selectLi1 = browser.driver.findElement(
          by.css('advanced-criteria-control-xml tbody tr:nth-child(37)'));
        expect(selectLi1.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectLi1).click().perform();

        let selectLi1_1 = browser.driver.findElement(
          by.css('advanced-criteria-control-xml tbody tr:nth-child(38)'));
        browser.actions().mouseMove(selectLi1_1).click().perform();

        browser.sleep(2000);

        browser.actions().mouseMove(selectLi1).click().perform();

        let inputActualFrames1 = browser.driver.findElement(
          by.css('tree-node-children tree-node:nth-child(1) input'));
        inputActualFrames1.clear();
        inputActualFrames1.sendKeys('123');

        let btnOk = browser.driver.findElement(
          by.css('advanced-criteria-control-xml .modal-content .modal-footer:nth-child(3) button'));
        btnOk.click();

        browser.sleep(2000);

        expect(customMetadata.getText()).toBe('64|Film|/Film/Actual_Frames[1];123');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        customMetadata.click();

        browser.sleep(2000);

        let inputActualFrames2 = browser.driver.findElement(
          by.css('tree-node-children tree-node:nth-child(1) input'));
        inputActualFrames2.getAttribute('value').then(function(value) {
            expect(value).toBe('123');
        });

        let btnClose = browser.driver.findElement(
          by.css('xml div.modal-footer button:nth-child(1)'));
        btnClose.click();

        browser.sleep(2000);

        expect(customMetadata.getText()).toBe('64|Film|/Film/Actual_Frames[1];123');
    };
    function enterData8(data) {
        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(data).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectParameter, {x: 10000, y: 10000}).click().perform();

        browser.sleep(2000);

        let selectLocation = browser.driver.findElement(
          by.css('advanced-criteria-control-hierarchical-lookupsearch-location-modal ' +
            'button.btn-default'));
        selectLocation.click();

        browser.sleep(1000);

        let choiseLocation = browser.driver.findElement(
          by.css('imfx-controls-tree li:nth-child(1) ' +
            'span.fancytree-has-children span.fancytree-checkbox'));
        choiseLocation.click();

        let btnOk = browser.driver.findElement(
          by.css('location div.modal-footer button'));
        btnOk.click();

        browser.sleep(2000);

        expect(selectLocation.getText()).toBe('ASTRO');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.sleep(1000);
    };

    xit('(e2e) Should get the entered data depending on the choised parameter', () => {
        // loginToApp();

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();

        browser.sleep(2000);

        let searchString = 'ix3';
        let searchInput = browser.driver.findElement(by.css('.test-search-form-input'));
        searchInput.clear();

        browser.sleep(2000);

        searchInput.sendKeys(searchString);

        browser.sleep(1000);

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();

        enterData1('Access Status');
        enterData2('Active Format Description');
        enterData3('XML Schema');
        enterData4('Closed Captions');
        enterData5('Aspect');
        enterData6('Created Date'); // (A)(R)
        enterData7('Custom Metadata');
        enterData8('Location');

        browser.sleep(1000);

        advanceButton.click();

        browser.sleep(1000);
    });

    it('(e2e) Should get the searched data, when clicked at recent searche', () => {
        // loginToApp();

        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        });

        browser.sleep(1000);

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys('Network').perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.sleep(2000);

        let selectData = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2-selection__rendered'));
        expect(selectData.isDisplayed()).toBe(true);
        browser.actions().mouseMove(selectData).click().perform();

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(13)'));
        browser.actions().mouseMove(selectLi1).click().perform();
        expect(selectData.getText()).toBe('DLA');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);

        // let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        let btnClear = browser.driver.findElement(
          by.css('.test-advanced-searching-button-clear'));
        btnClear.click();

        let searchRecent = browser.driver.findElement(
          by.css('.recents.searches div:nth-child(1)'));
        browser.actions().mouseMove(searchRecent).click().perform();

        browser.sleep(1000);

        let selectParameter2 = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        expect(selectParameter2.isDisplayed()).toBe(true);
        expect(selectParameter2.getText()).toBe('Network');

        let selectData2 = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2-selection__rendered'));
        expect(selectData2.isDisplayed()).toBe(true);
        expect(selectData2.getText()).toBe('DLA');

        // let div2 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        // let rows2 = div2.findElements(by.css('.slick-row')).then(function(value) {
        //     let leng = value.length;
        //     if (leng === 0) {
        //         expect(value).toEqual([]);
        //     } else {
        //         expect(value).not.toEqual([]);
        //     };
        // });

        browser.driver.findElement(by.css('.test-advanced-searching-button')).click();
    });
});
