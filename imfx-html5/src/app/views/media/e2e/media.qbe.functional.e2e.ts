/**
 * Created by dvvla on 24.07.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../../../tests/e2e/login-helper';
import { logoutFromApp } from '../../../tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

interface BaseOptions {
    dateFrom: boolean;
    dateTo: boolean;
    enterDate: boolean;
    selectDate: boolean;
    relativeDate: boolean;
    absoluteDate: boolean;
    relativeDateFrom: boolean;
    relativeDateTo: boolean;
    absoluteDateFrom: boolean;
    absoluteDateTo: boolean;
    caption: boolean;
    clear: boolean;
    network: boolean;
};

describe('(e2e) App Media. Query by example(functional)', () => {

    const network = 'advanced-criteria-control-combosingle span.select2';
    const spanDateFrom = 'div.criteria-group-item:nth-child(2) span.select2';
    const spanDateTo = 'div.criteria-group-item:nth-child(3) span.select2';
    const btnDateFrom = 'div.criteria-group-item:nth-child(2) button';
    const btnDateTo = 'div.criteria-group-item:nth-child(3) button';
    const inputDateFrom = 'div.criteria-group-item:nth-child(2) input';
    const inputDateTo = 'div.criteria-group-item:nth-child(3) input';
    const caption = 'div.criteria-group-item:nth-child(4) input';

    beforeEach(() => {
        browser.get('./#/login');
        loginToApp();
    });

    afterEach(() => {
        logoutFromApp();
    });

    function repetition1() {
        // loginToApp();

        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {
            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
                by.css('.test-advanced-searching-button')).click();

            browser.sleep(1000);

            let btnQueryExample = browser.driver.findElement(by.css('.test-adv-qbe-btn'));
            btnQueryExample.click();
        });

        // browser.sleep(5000);

        // let advanceButton = browser.driver.findElement(
        //     by.css('.test-advanced-searching-button')).click();

        // browser.sleep(1000);

        // let btnQueryExample = browser.driver.findElement(by.css('.test-adv-qbe-btn'));
        // btnQueryExample.click();
    }

    it('(e2e) 1. Should get the disable(search btn), ' +
        'when have not date from, date to without network', () => {
        // loginToApp();

        repetition1();

        let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
        inputAbsoluteDateFrom.clear();

        browser.sleep(1000);

        let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
        inputAbsoluteDateTo.clear();

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        expect(btnSearch.isEnabled()).toBe(false);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button')).click();
    });

    it('(e2e) 2. Should get the enable(search btn), ' +
        'when have not date from, date to without network with ClosedCaption', () => {
        repetition1();

        let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
        inputAbsoluteDateFrom.clear();

        browser.sleep(1000);

        let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
        inputAbsoluteDateTo.clear();

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        expect(btnSearch.isEnabled()).toBe(false);

        let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
        browser.actions().mouseMove(checkboxClosedCaption).click().perform();

        searchData();

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button')).click();
    });

    function searchData() {
        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        expect(btnSearch.isEnabled()).toBe(true);

        btnSearch.click();

        browser.sleep(1000);

        let div1 = browser.driver.findElement(by.css('media .slick-viewport-top .grid-canvas-right'));
        div1.findElements(by.css('.slick-row')).then(function(value) {
            let leng = value.length;
            if (leng === 0) {
                expect(value).toEqual([]);
            } else {
                expect(value).not.toEqual([]);
            };
        });
    }

    // Select network
    function chooseNetworkMouse(result, option) {
        let selectNetwork = browser.driver.findElement(by.css(network));
        browser.actions().mouseMove(selectNetwork).click().perform();

        browser.sleep(1000).then(() => {
            let selectLi = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(' + option + ')'));
            expect(selectLi.getText()).toBe(result);
            browser.actions().mouseMove(selectLi).click().perform();
        });

        let spanText = browser.driver.findElement(
          by.css('advanced-group-example imfx-lookups-select2 .select2-selection__rendered'));
        expect(spanText.getText()).toBe(result);

        searchData();
    }

    it('(e2e) 3. Should get the enable(search btn), ' +
        'for every choose parameter(Select a name with the mouse)', () => {
        repetition1();

        browser.sleep(1000);

        chooseNetworkMouse('A-List HD', '1');
        chooseNetworkMouse('ABC', '2');
        chooseNetworkMouse('AHC', '3');
        chooseNetworkMouse('ARQ', '4');
        chooseNetworkMouse('Animal Planet Europe', '5');
        chooseNetworkMouse('Astro AEC HD', '6');
        chooseNetworkMouse('Astro Bolly One HD', '7');

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button')).click();
    });

    // Enter network
    function chooseNetworkKeyboard(result) {
        let selectNetwork = browser.driver.findElement(by.css(network));
        browser.actions().mouseMove(selectNetwork).click().perform();

        browser.sleep(1000).then(() => {
            browser.actions().sendKeys(result).perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.sleep(1000);

        let spanText = browser.driver.findElement(
          by.css('advanced-group-example imfx-lookups-select2 .select2-selection__rendered'));
        expect(spanText.getText()).toBe(result);

        searchData();
    }

    it('(e2e) 4. Should get the enable(search btn), ' +
        'for every choose parameter(Enter name from the keyboard)', () => {
        repetition1();

        browser.sleep(1000);

        chooseNetworkKeyboard('A-List HD');
        chooseNetworkKeyboard('ABC');
        chooseNetworkKeyboard('AHC');
        chooseNetworkKeyboard('ARQ');
        chooseNetworkKeyboard('Animal Planet Europe');
        chooseNetworkKeyboard('Astro AEC HD');
        chooseNetworkKeyboard('Astro Bolly One HD');

      let advanceButton = browser.driver.findElement(
        by.css('.test-advanced-searching-button')).click();
    });

    // Enter data
    it('(e2e) 5. Should get the enable(search btn), ' +
        'when enter date from, date to without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 6. Should get the enable(search btn), ' +
        'when enter date from without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 7. Should get the enable(search btn), ' +
        'when enter ate to without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    // Select data
    it('(e2e) 8. Should get the enable(search btn), ' +
        'when select date from, date to without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 9. Should get the enable(search btn), ' +
        'when select date from without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 10. Should get the enable(search btn), ' +
        'when select date to without network(A), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    // Enter data
    it('(e2e) 11. Should get the enable(search btn), ' +
        'when enter date from, date to without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 12. Should get the enable(search btn), ' +
        'when enter date from without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 13. Should get the enable(search btn), ' +
        'when enter date to without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    // Select data
    it('(e2e) 14. Should get the enable(search btn), ' +
        'when select date from, date to without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 15. Should get the enable(search btn), ' +
        'when select date from without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 16. Should get the enable(search btn), ' +
        'when select date to without network(A), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: false
        };
        base(option);
    });

    // Enter data
    it('(e2e) 17. Should get the enable(search btn), ' +
        'when enter date from, date to without network(R), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 18. Should get the enable(search btn), ' +
        'when enter date from without network(R), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 19. Should get the enable(search btn), ' +
        'when enter date to without network(R), ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    // Enter data
    it('(e2e) 20. Should get the enable(search btn), ' +
        'when enter date from, date to without network(R), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 21. Should get the enable(search btn), ' +
        'when enter date from without network(R), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    it('(e2e) 22. Should get the enable(search btn), ' +
        'when enter date to without network(R), with ClosedCaption', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: false
        };
        base(option);
    });

    function base(option) {
        if ((option.enterDate === true) && (option.absoluteDate === true)) {
            if (option.network === true) {
                repetition2();
            } else {
                repetition1();
            }

            if (option.dateFrom === true) {
                let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
                inputAbsoluteDateFrom.clear();

                browser.sleep(1000);

                inputAbsoluteDateFrom.sendKeys('01.06.201702:38');
                // inputAbsoluteDateFrom.click();

                inputAbsoluteDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            };

            if (option.dateTo === true) {
                let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
                inputAbsoluteDateTo.clear();

                browser.sleep(1000);

                inputAbsoluteDateTo.sendKeys('01.06.201702:38');
                // inputAbsoluteDateTo.click();

                inputAbsoluteDateTo.getAttribute('value').then(function (value) {
                    expect(value).not.toBe('');
                });
            };

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            browser.sleep(1000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.selectDate === true) && (option.absoluteDate === true)) {
            if (option.network === true) {
                repetition2();
            } else {
                repetition1();
            }

            if (option.dateFrom === true) {
                let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
                inputAbsoluteDateFrom.clear();

                browser.sleep(2000);

                browser.driver.findElement(
                    by.xpath('//div[2]/div[1]/div[2]/table/tbody/tr[2]/td[1]/div')).click();

                inputAbsoluteDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            };

            if (option.dateTo === true) {
                let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
                inputAbsoluteDateTo.clear();

                browser.sleep(1000);

                let datePick = browser.driver.findElement(
                  by.css('.xdsoft_datetimepicker:nth-child(6) tr:nth-child(2) .xdsoft_day_of_week0'));
                datePick.click();

                inputAbsoluteDateTo.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            };

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.enterDate === true) && (option.relativeDate === true)) {
            if (option.network === true) {
                repetition2();
            } else {
                repetition1();
            }

            if (option.dateFrom === true) {
                let buttonDateFrom = browser.driver.findElement(by.css(btnDateFrom));
                browser.actions().mouseMove(buttonDateFrom).click().perform();

                let selectRelativeDateFrom = browser.driver.findElement(by.css(spanDateFrom));
                browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

                let selectLi1 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectLi1).click().perform();

                let inputRelativeDateFrom = browser.driver.findElement(by.css(inputDateFrom));

                // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
                inputRelativeDateFrom.clear();
                browser.sleep(1000);
                inputRelativeDateFrom.sendKeys('5');

                inputRelativeDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            };

            if (option.dateTo === true) {
                let buttonDateTo = browser.driver.findElement(by.css(btnDateTo));
                browser.actions().mouseMove(buttonDateTo).click().perform();

                let selectRelativeDateTo = browser.driver.findElement(by.css(spanDateTo));
                browser.actions().mouseMove(selectRelativeDateTo).click().perform();

                let selectLi2 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectLi2).click().perform();

                let inputRelativeDateTo = browser.driver.findElement(by.css(inputDateTo));

                // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
                inputRelativeDateTo.clear();
                browser.sleep(1000);
                inputRelativeDateTo.sendKeys('5');

                inputRelativeDateTo.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            };

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            browser.sleep(1000);

            if (option.dateFrom === true) {
                let selectRelativeDateFrom = browser.driver.findElement(by.css(spanDateFrom));
                browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

                let selectLi3 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(2)'));
                browser.actions().mouseMove(selectLi3).click().perform();

                let inputRelativeDateFrom = browser.driver.findElement(by.css(inputDateFrom));

                // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
                inputRelativeDateFrom.clear();
                browser.sleep(1000);
                inputRelativeDateFrom.sendKeys('5');

                inputRelativeDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            }

            browser.sleep(1000);

            if (option.dateTo === true) {
                let selectRelativeDateTo = browser.driver.findElement(by.css(spanDateTo));
                browser.actions().mouseMove(selectRelativeDateTo).click().perform();

                browser.sleep(1000);

                let selectLi4 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(2)'));
                browser.actions().mouseMove(selectLi4).click().perform();

                let inputRelativeDateTo = browser.driver.findElement(by.css(inputDateTo));

                // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
                inputRelativeDateTo.clear();
                browser.sleep(1000);
                inputRelativeDateTo.sendKeys('5');

                inputRelativeDateTo.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });
            }

            searchData();

            if ((option.dateFrom === true) && (option.dateTo === true)) {
                let selectRelativeDateFrom = browser.driver.findElement(by.css(spanDateFrom));
                browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

                let selectLi5 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectLi5).click().perform();

                let inputRelativeDateFrom = browser.driver.findElement(by.css(inputDateFrom));

                // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
                inputRelativeDateFrom.clear();
                browser.sleep(1000);
                inputRelativeDateFrom.sendKeys('5');

                inputRelativeDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });

                browser.sleep(1000);

                let selectRelativeDateTo = browser.driver.findElement(by.css(spanDateTo));
                browser.actions().mouseMove(selectRelativeDateTo).click().perform();

                let selectLi6 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(2)'));
                browser.actions().mouseMove(selectLi6).click().perform();

                let inputRelativeDateTo = browser.driver.findElement(by.css(inputDateTo));

                // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
                inputRelativeDateTo.clear();
                browser.sleep(1000);
                inputRelativeDateTo.sendKeys('5');

                inputRelativeDateTo.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });

                searchData();

                browser.sleep(1000);

                browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

                let selectLi7 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(2)'));
                browser.actions().mouseMove(selectLi7).click().perform();

                // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
                inputRelativeDateFrom.clear();
                browser.sleep(1000);
                inputRelativeDateFrom.sendKeys('5');
                browser.sleep(1000);
                inputRelativeDateFrom.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });

                browser.sleep(1000);

                browser.actions().mouseMove(selectRelativeDateTo).click().perform();

                let selectLi8 = browser.driver.findElement(
                  by.css('ul.select2-results__options li:nth-child(1)'));
                browser.actions().mouseMove(selectLi8).click().perform();

                // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
                inputRelativeDateTo.clear();
                browser.sleep(1000);
                inputRelativeDateTo.sendKeys('5');

                inputRelativeDateTo.getAttribute('value').then(function (value) {
                  expect(value).not.toBe('');
                });

                searchData();
            }

            browser.sleep(1000);

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.enterDate) && (option.absoluteDateFrom) && (option.relativeDateTo)) {
            repetition2();

            let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
            inputAbsoluteDateFrom.clear();

            browser.sleep(1000);

            inputAbsoluteDateFrom.sendKeys('01.06.201702:38');
            // inputAbsoluteDateFrom.click();

            inputAbsoluteDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            let buttonDateTo = browser.driver.findElement(by.css(btnDateTo));
            browser.actions().mouseMove(buttonDateTo).click().perform();

            let selectRelativeDateTo = browser.driver.findElement(by.css(spanDateTo));
            browser.actions().mouseMove(selectRelativeDateTo).click().perform();

            browser.sleep(1000);

            let inputRelativeDateTo = browser.driver.findElement(by.css(inputDateTo));

            let selectLi1 = browser.driver.findElement(by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi1).click().perform();

            // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
            inputRelativeDateTo.clear();
            inputRelativeDateTo.sendKeys('5');

            inputRelativeDateTo.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            browser.sleep(1000);

            browser.actions().mouseMove(selectRelativeDateTo).click().perform();

            let selectLi2 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(2)'));
            browser.actions().mouseMove(selectLi2).click().perform();

            // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
            inputRelativeDateTo.clear();
            inputRelativeDateTo.sendKeys('5');

            inputRelativeDateTo.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            browser.sleep(1000);

            searchData();

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.enterDate) && (option.relativeDateFrom) && (option.absoluteDateTo)) {
            repetition2();

            let buttonDateFrom = browser.driver.findElement(by.css(btnDateFrom));
            browser.actions().mouseMove(buttonDateFrom).click().perform();

            let selectRelativeDateFrom = browser.driver.findElement(by.css(spanDateFrom));
            browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

            browser.sleep(1000);

            let inputRelativeDateFrom = browser.driver.findElement(by.css(inputDateFrom));

            let selectLi1 = browser.driver.findElement(by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi1).click().perform();

            // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
            inputRelativeDateFrom.clear();
            inputRelativeDateFrom.sendKeys('5');

            inputRelativeDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
            inputAbsoluteDateTo.clear();

            browser.sleep(1000);

            inputAbsoluteDateTo.sendKeys('01.06.201702:38');
            // inputAbsoluteDateTo.click();

            inputAbsoluteDateTo.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

            let selectLi2 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(2)'));
            browser.actions().mouseMove(selectLi2).click().perform();

            // browser.actions().mouseMove(inputRelativeDateFrom).click().perform();
            inputRelativeDateFrom.clear();
            inputRelativeDateFrom.sendKeys('5');

            inputRelativeDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            searchData();

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.selectDate) && (option.absoluteDateFrom) && (option.relativeDateTo)) {
            repetition2();

            let inputAbsoluteDateFrom = browser.driver.findElement(by.css(inputDateFrom));
            inputAbsoluteDateFrom.clear();

            browser.sleep(1000);

            browser.driver.findElement(
                by.xpath('//div[2]/div[1]/div[2]/table/tbody/tr[2]/td[1]/div')).click();

            inputAbsoluteDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            browser.sleep(1000);

            let buttonDateTo = browser.driver.findElement(by.css(btnDateTo));
            browser.actions().mouseMove(buttonDateTo).click().perform();

            let selectRelativeDateTo = browser.driver.findElement(by.css(spanDateTo));
            browser.actions().mouseMove(selectRelativeDateTo).click().perform();

            browser.sleep(1000);

            let inputRelativeDateTo = browser.driver.findElement(by.css(inputDateTo));

            let selectLi1 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi1).click().perform();

            // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
            inputRelativeDateTo.clear();
            inputRelativeDateTo.sendKeys('5');

            inputRelativeDateTo.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(
                  by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            browser.sleep(1000);

            browser.actions().mouseMove(selectRelativeDateTo).click().perform();

            let selectLi2 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(2)'));
            browser.actions().mouseMove(selectLi2).click().perform();

            // browser.actions().mouseMove(inputRelativeDateTo).click().perform();
            inputRelativeDateTo.clear();
            browser.sleep(1000);
            inputRelativeDateTo.sendKeys('5');

            inputRelativeDateTo.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            searchData();

            browser.sleep(1000);

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
        else if ((option.selectDate) && (option.relativeDateFrom) && (option.absoluteDateTo)) {
            repetition2();

            let buttonDateFrom = browser.driver.findElement(by.css(btnDateFrom));
            browser.actions().mouseMove(buttonDateFrom).click().perform();

            let selectRelativeDateFrom = browser.driver.findElement(by.css(spanDateFrom));
            browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

            browser.sleep(1000);

            let inputRelativeDateFrom = browser.driver.findElement(by.css(inputDateFrom));

            let selectLi1 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(1)'));
            browser.actions().mouseMove(selectLi1).click().perform();

            inputRelativeDateFrom.clear();
            inputRelativeDateFrom.sendKeys('5');

            inputRelativeDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            let inputAbsoluteDateTo = browser.driver.findElement(by.css(inputDateTo));
            inputAbsoluteDateTo.clear();

            browser.sleep(1000);

            let datePick = browser.driver.findElement(
              by.css('.xdsoft_datetimepicker:nth-child(6) tr:nth-child(2) .xdsoft_day_of_week0'));
            datePick.click();

            inputAbsoluteDateTo.getAttribute('value').then(function (value) {
                expect(value).not.toBe('');
            });

            if (option.caption === true) {
                let checkboxClosedCaption = browser.driver.findElement(
                  by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            searchData();

            browser.sleep(1000);

            browser.actions().mouseMove(selectRelativeDateFrom).click().perform();

            let selectLi2 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(2)'));
            browser.actions().mouseMove(selectLi2).click().perform();

            inputRelativeDateFrom.clear();
            inputRelativeDateFrom.sendKeys('5');

            inputRelativeDateFrom.getAttribute('value').then(function (value) {
              expect(value).not.toBe('');
            });

            searchData();

            browser.sleep(1000);

            if (option.clear === true) {
                let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
                expect(btnSearch.isEnabled()).toBe(true);

                let btnClear = browser.driver.findElement(
                  by.css('.test-advanced-searching-button-clear'));
                btnClear.click();

                browser.sleep(1000);

                expect(btnSearch.isEnabled()).toBe(false);
            }

            if ((option.clear === false) && (option.caption === true)) {
                let checkboxClosedCaption = browser.driver.findElement(by.css(caption));
                browser.actions().mouseMove(checkboxClosedCaption).click().perform();
            }

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button')).click();
        }
    };

    function repetition2() {
        repetition1();

        browser.sleep(1000);

        let selectNetwork = browser.driver.findElement(by.css(network));
        browser.actions().mouseMove(selectNetwork).click().perform();

        browser.sleep(2000).then(() => {
            browser.actions().sendKeys('ARQ').perform();
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        });

        browser.actions().mouseMove(selectNetwork, {x: 10000, y: 10000}).click().perform();

        browser.sleep(1000);
    }

    // Enter data, with ClosedCaption
    it('(e2e) 23. Should get the enable(search btn), when enter date from ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 24. Should get the enable (search btn), when enter date to ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 25. Should get the enable(search btn), when enter date from, date to ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    // Select data, with ClosedCaption
    it('(e2e) 26. Should get the enable(search btn), when select date from ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 27. Should get the enable(search btn), when select date to ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 28. Should get the enable(search btn), when select date from, date to ' +
        'with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    // Enter data, without ClosedCaption
    it('(e2e) 29. Should get the enable(search btn), ' +
        'when enter date from without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 30. Should get the enable(search btn), ' +
        'when enter date to without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 31. Should get the enable(search btn), ' +
        'when enter date from, date to without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            enterDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    // Select data, without ClosedCaption
    it('(e2e) 32. Should get the enable(search btn), ' +
        'when select date from without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 33. Should get the enable(search btn), ' +
        'when select date to without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 34. Should get the enable(search btn), ' +
        'when select date from, date to without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            selectDate: true,
            absoluteDate: true,
            network: true
        };
        base(option);
    });

    //  Enter date(R), without ClosedCaption
    it('(e2e) 35. Should get the enable(search btn), select date(days, hours) ' +
        'and enter date from without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 36. Should get the enable(search btn), select date(days, hours) ' +
        'enter date to without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 37. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from, date to without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: false,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    // Enter date(R) and enter date(A), without ClosedCaption
    it('(e2e) 38. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from(R), date to(A) without ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: false,
            enterDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    it('(e2e) 39. Should get the enable(search btn), select date(days, hours) ' +
        'enter date to(R), date from(A) without ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: false,
            enterDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    // Enter date(R) and select date(A), without ClosedCaption
    it('(e2e) 40. Should get the enable(search btn), select date ' +
        'enter date from(R), select date to(A) without ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: false,
            selectDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    it('(e2e) 41. Should get the enable(search btn), select date ' +
        'enter date to(R), select date from(A) without ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: false,
            selectDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    //  Enter date(R), with ClosedCaption
    it('(e2e) 42. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 43. Should get the enable(search btn), select date(days, hours) ' +
        'enter date to with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 44. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from, date to with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            caption: true,
            enterDate: true,
            relativeDate: true,
            network: true
        };
        base(option);
    });

    // Enter date(R) and enter date(A), with ClosedCaption
    it('(e2e) 45. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from(R), date to(A) with ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: true,
            enterDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    it('(e2e) 46. Should get the enable(search btn), select date(days, hours) ' +
        'enter date to(R), date from(A) with ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: true,
            enterDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    // Enter date(R) and select date(A), with ClosedCaption
    it('(e2e) 47. Should get the enable(search btn), select date(days, hours) ' +
        'enter date from(R), select date to(A) with ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: true,
            selectDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    it('(e2e) 48. Should get the enable(search btn), select date(days, hours) ' +
        'enter date to(R), select date from(A) with ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: true,
            selectDate: true,
            clear: false,
            network: true
        };
        base(option);
    });

    // Enter date(A), without ClosedCaption, click Clear
    it('(e2e) 49. Should get the disable(search btn), when enter date from, ' +
        'after click clear btn without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            enterDate: true,
            caption: false,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 50. Should get the disable(search btn), when enter date to, ' +
        'after click clear btn without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            enterDate: true,
            caption: false,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 51. Should get the disable(search btn), when enter date from, date to, ' +
        'after click clear btn without ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            enterDate: true,
            caption: false,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date(A), with ClosedCaption, click Clear
    it('(e2e) 52. Should get the disable(search btn), when enter date from, ' +
        'after click clear btn with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            enterDate: true,
            caption: true,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 53. Should get the disable(search btn), when enter date to, ' +
        'after click clear btn with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            enterDate: true,
            caption: true,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 54. Should get the disable(search btn), when enter date from, date to, ' +
        'after click clear btn with ClosedCaption(A)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            enterDate: true,
            caption: true,
            absoluteDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date(R), without ClosedCaption, click Clear
    it('(e2e) 55. Should get the disable(search btn), when enter date from, ' +
        'after click clear btn without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            enterDate: true,
            caption: false,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 56. Should get the disable(search btn), when enter date to, ' +
        'after click clear btn without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            enterDate: true,
            caption: false,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 57. Should get the disable(search btn), when enter date from, date to, ' +
        'after click clear btn without ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            enterDate: true,
            caption: false,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date(R), with ClosedCaption, click Clear
    it('(e2e) 58. Should get the disable(search btn), when enter date from, ' +
        'after click clear btn with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: false,
            enterDate: true,
            caption: true,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 59. Should get the disable(search btn), when enter date to, ' +
        'after click clear btn with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: false,
            dateTo: true,
            enterDate: true,
            caption: true,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    it('(e2e) 60. Should get the disable(search btn), when enter date from, date to, ' +
        'after click clear btn with ClosedCaption(R)', () => {
        let option = <BaseOptions>{
            dateFrom: true,
            dateTo: true,
            enterDate: true,
            caption: true,
            relativeDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(A) and date to(R), without ClosedCaption
    it('(e2e) 61. Should get the disable(search btn), when enter date from(A), date to(R), ' +
        'after click clear btn without ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: false,
            enterDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(R) and date to(A). without ClosedCaption
    it('(e2e) 62. Should get the disable(search btn), when enter date from(R), date to(A), ' +
        'after click clear btn without ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: false,
            enterDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(A) and date to(R), with ClosedCaption
    it('(e2e) 63. Should get the disable(search btn), when enter date from(A), date to(R), ' +
        'after click clear btn with ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: true,
            enterDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(R) and date to(A) with ClosedCaption
    it('(e2e) 64. Should get the disable(search btn), when enter date from(R), date to(A), ' +
        'after click clear btn with ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: true,
            enterDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Select date from(A) and enter date to(R), without ClosedCaption
    it('(e2e) 65. Should get the disable(search btn), select date from(A), ' +
        'enter date to(R), after click clear btn without ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: false,
            selectDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(R) and select date to(A). without ClosedCaption
    it('(e2e) 66. Should get the disable(search btn), enter date from(R), ' +
        'select date to(A), after click clear btn without ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: false,
            selectDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Select date from(A) and enter date to(R), with ClosedCaption
    it('(e2e) 67. Should get the disable(search btn), select date from(A), ' +
        'enter date to(R), after click clear btn with ClosedCaption', () => {
        let option = <BaseOptions>{
            absoluteDateFrom: true,
            relativeDateTo: true,
            caption: true,
            selectDate: true,
            clear: true,
            network: true
        };
        base(option);
    });

    // Enter date from(R) and select date to(A) with ClosedCaption
    it('(e2e) 68. Should get the disable(search btn), enter date from(R), ' +
        'select date to(A), after click clear btn with ClosedCaption', () => {
        let option = <BaseOptions>{
            relativeDateFrom: true,
            absoluteDateTo: true,
            caption: true,
            selectDate: true,
            clear: true,
            network: true
        };
        base(option);
    });
});
