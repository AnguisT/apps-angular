/**
 * Created by dvvla on 24.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../../../tests/e2e/login-helper';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) App Media. Query builder(ui)', () => {

    beforeEach(() => {
        browser.get('./#/login');
    });

    afterAll(() => {
      logoutFromApp();
    });

    // afterEach(() => {
    //     logoutFromApp();
    // });

    function repetition() {
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
      // let advanceButton = browser.driver.findElement(
      //   by.css('.test-advanced-searching-button'));
      // advanceButton.click();

      // let btnAddGroup = browser.driver.findElement(
      //   by.css('.test-advanced-searching-button-add-group'));
      // btnAddGroup.click();
    }

    it('(e2e) Should get the advanced button', () => {
        loginToApp();
        expect(browser.isElementPresent(element(by.css('.test-advanced-searching-button'))))
          .toBe(true);
    });

    it('(e2e) Should get the div advanced search', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let searchBlock = browser.driver.findElement(
              by.css('.test-advanced-searching-div-advanced-search-block'));
            expect(searchBlock.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the div advanced-group', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let advancedGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-div-advanced-group'));
            expect(advancedGroup.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the div recent searches', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let recentSearches = browser.driver.findElement(
              by.css('.test-advanced-searching-div-recent-searches'));
            expect(recentSearches.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the button Query builder', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let btnQueryBuilder = browser.driver.findElement(by.css('.test-adv-qba-btn'));
            expect(btnQueryBuilder.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the button Add group', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            expect(btnAddGroup.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the dropdown list for saved search', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(3000);

            let selectSavedSearch = browser.driver.findElement(
              by.css('#selectSavedSearch span.select2'));
            expect(selectSavedSearch.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the dropdown list for parameters', () => {
        repetition();

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        expect(selectParameter.isDisplayed()).toBe(true);

        browser.sleep(3000);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the dropdown list for type condition', () => {
        repetition();

        let selectTypeCondition = browser.driver.findElement(
          by.css('advanced-criteria-operators span.select2'));
        expect(selectTypeCondition.isDisplayed()).toBe(true);

        browser.sleep(3000);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the control (widget or plugin) for setting value of parameters', () => {
        repetition();

        let input = browser.driver.findElement(
          by.css('advanced-criteria-controls input'));
        expect(input.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button remove group', () => {
        repetition();

        let btnRemoveGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-group-builder'));
        expect(btnRemoveGroup.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button remove criteria', () => {
        repetition();

        let btnRemoveCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-remove-criteria-builder'));
        expect(btnRemoveCriteria.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button add criteria', () => {
        repetition();

        let btnAddCriteria = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-criteria-builder'));
        expect(btnAddCriteria.isDisplayed()).toBe(true);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();
    });

    it('(e2e) Should get the button save', () => {
        repetition();

        let btnSaveSearch = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        expect(btnSaveSearch.isDisplayed()).toBe(true);

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

    it('(e2e) Should get the button new after choose saved search', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000).then(() => {
                let selectSavedSearch = browser.driver.findElement(
                  by.css('#selectSavedSearch span.select2'));
                browser.actions().mouseMove(selectSavedSearch).click().perform();
            });

            browser.sleep(2000).then(() => {
                let selectedParameter = browser.driver.findElement(
                  by.css('.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectedParameter).click().perform();
            });

            let btnNew = browser.driver.findElement(
              by.css('.test-advanced-searching-button-new-builder'));
            expect(btnNew.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the button remove after choose saved search', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000).then(() => {
                let selectSavedSearch = browser.driver.findElement(
                  by.css('#selectSavedSearch span.select2'));
                browser.actions().mouseMove(selectSavedSearch).click().perform();
            });

            browser.sleep(2000).then(() => {
                let selectedParameter = browser.driver.findElement(
                  by.css('.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectedParameter).click().perform();
            });

            let btnRemove = browser.driver.findElement(
              by.css('.test-advanced-searching-button-remove-builder'));
            expect(btnRemove.isDisplayed()).toBe(true);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the div modal-dialog after click on button save', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();

            let btnSaveSearch = browser.driver.findElement(
              by.css('.test-advanced-searching-button-save-builder'));
            btnSaveSearch.click();

            browser.sleep(2000).then(() => {
              let modalDialog = browser.driver.findElement(
                by.css('imfx-modal'));
              expect(modalDialog.isDisplayed()).toBe(true);
            });

            browser.sleep(2000).then(() => {
                let modalDialogBtnCancel = browser.driver.findElement(
                  by.css('imfx-modal button.pull-left'));
                modalDialogBtnCancel.click();
            });

            browser.sleep(2000);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the input on modal-dialog', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();

            let btnSaveSearch = browser.driver.findElement(
              by.css('.test-advanced-searching-button-save-builder'));
            browser.actions().mouseMove(btnSaveSearch).click().perform();

            browser.sleep(2000).then(() => {
                let modalDialogInput = browser.driver.findElement(
                  by.id('modalPromptInput'));
                expect(modalDialogInput.isDisplayed()).toBe(true);
            });

            browser.sleep(2000).then(() => {
                let modalDialogBtnCancel = browser.driver.findElement(
                  by.css('imfx-modal button.pull-left'));
                modalDialogBtnCancel.click();
            });

            browser.sleep(2000);
            advanceButton.click();
        });
    });

    it('(e2e) Should get the button save on modal-dialog', () => {
        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let btnAddGroup = browser.driver.findElement(
              by.css('.test-advanced-searching-button-add-group'));
            btnAddGroup.click();

            let btnSaveSearch = browser.driver.findElement(
              by.css('.test-advanced-searching-button-save-builder'));
            browser.actions().mouseMove(btnSaveSearch).click().perform();

            browser.sleep(2000).then(() => {
                let modalDialogBtnSave = browser.driver.findElement(
                  by.css('imfx-modal button.primary'));
                expect(modalDialogBtnSave.isDisplayed()).toBe(true);
            });

            browser.sleep(2000).then(() => {
                let modalDialogBtnCancel = browser.driver.findElement(
                  by.css('imfx-modal button.pull-left'));
                modalDialogBtnCancel.click();
            });

            browser.sleep(2000);

            advanceButton.click();
        });
    });

    it('(e2e) Should get the button cancel on modal-dialog', () => {
        repetition();

        let btnSaveSearch = browser.driver.findElement(
          by.css('.test-advanced-searching-button-save-builder'));
        browser.actions().mouseMove(btnSaveSearch).click().perform();

        browser.sleep(2000).then(() => {
            let modalDialogBtnCancel = browser.driver.findElement(
              by.css('imfx-modal button.pull-left'));
            expect(modalDialogBtnCancel.isDisplayed()).toBe(true);
            modalDialogBtnCancel.click();
        });

        browser.sleep(2000).then(() => {
            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();
        });
    });
});
