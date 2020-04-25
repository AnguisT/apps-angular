import {browser, by, element} from "protractor";
import {waitVisibility, waitVisibilityAndClick} from "../../../app/tests/e2e/common-helper";
import {WebElement} from "selenium-webdriver";

function checkCell(numbers, result) {
    let cell = browser.driver.findElement(
        by.css('.slick-pane-right .slick-header-column:nth-child(' + numbers + ') .slick-column-name'));
    expect(cell.getText()).toBe(result);
    browser.sleep(1000);
}

function selectColumnByName(str: string, inputData: WebElement) {
    inputData.clear();
    inputData.sendKeys('id');
    waitVisibilityAndClick(by.css('.js-scrollbar-target-modal-one div:nth-child(3) input')).then(() => {
        console.log('input str', str)
    })
}

export function caseGridViews() {
    it('(e2e) 2. Should get a new view for search', () => {

        waitVisibilityAndClick(by.css('.test-search-settings-li-dropdown')).then((dropdown: WebElement) => {
            waitVisibilityAndClick(by.css('.test-search-settings-li-dropdown li:nth-child(1)')).then((selectLi2: WebElement) => {
                waitVisibility(by.css('.ms-search input')).then((inputData: WebElement) => {
                    // setup view
                    selectColumnByName('id', inputData);
                    selectColumnByName('title', inputData);
                    selectColumnByName('duration', inputData);
                    selectColumnByName('created date', inputData);
                    selectColumnByName('aspect', inputData);
                });
            });
        });

        //
        // let selectLi1 = browser.driver.findElement(
        //     by.css('.test-search-settings-li-dropdown li:nth-child(1)'));
        // browser.actions().mouseMove(selectLi1).click().perform();

        // browser.actions().mouseMove(dropdown).click().perform();
        //
        // browser.sleep(2000);
        //
        // let selectLi2 = browser.driver.findElement(
        //   by.css('.test-search-settings-li-dropdown li:nth-child(8)'));
        // browser.actions().mouseMove(selectLi2).click().perform();



        // browser.sleep(2000);
        //
        // let thumbsButton = browser.driver.findElement(by.css('.test-button-thumbs'));
        // browser.actions().mouseMove(thumbsButton).click().perform();
        //
        // browser.sleep(2000);
        //
        // browser.actions().mouseMove(dropdown).click().perform();
        //
        // browser.sleep(2000);
        //
        // let selectLi3 = browser.driver.findElement(
        //     by.css('.test-search-settings-li-dropdown li:nth-child(3)'));
        // browser.actions().mouseMove(selectLi3).click().perform();
        //
        // browser.sleep(2000);
        //
        // let titleView = browser.driver.findElement(
        //     by.id('modalPromptInput'));
        // browser.sleep(1000);
        // titleView.clear();
        //
        // browser.sleep(1000);
        //
        // titleView.sendKeys('GeneralTest');
        //
        // browser.sleep(1000);
        //
        // let buttonSave = browser.driver.findElement(
        //     by.css('imfx-modal button.primary'));
        // browser.actions().mouseMove(buttonSave).click().perform();
        //
        // browser.sleep(2000);
        //
        // browser.sleep(1000);
        //
        // checkCell(1, 'ID');
        // checkCell(2, 'Title');
        // checkCell(3, 'Duration');
        // checkCell(4, 'Created Date');
        // checkCell(5, 'Aspect');
        //
        // let spanSelect = browser.driver.findElement(
        //     by.css('search-views .select2-selection__rendered'));
        // expect(spanSelect.getText()).toBe('GeneralTest');
        //
        // browser.actions().mouseMove(dropdown).click().perform();
        //
        // let selectLi4 = browser.driver.findElement(
        //     by.css('.test-search-settings-li-dropdown li:nth-child(6)'));
        // browser.actions().mouseMove(selectLi4).click().perform();
        //
        // browser.sleep(1000);
        //
        // let btnOk = browser.driver.findElement(
        //     by.css('imfx-modal button.primary'));
        // browser.actions().mouseMove(btnOk).click().perform();
    });
}
