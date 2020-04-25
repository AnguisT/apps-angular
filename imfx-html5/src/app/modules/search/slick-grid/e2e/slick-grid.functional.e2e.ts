// 2.1. Should get the array found media items
// 2.2. Should get the div with text equal No result found
// 2.3. Should get the second page(Click on number)
// 2.4. Should get the second page(Click on button next page)
// 2.5. Should get the first page after select second page(Click on number)
// 2.6. Should get the first page after select second page(Click on button previous page)
// 2.7. Should get the last page(Click on button last page)
// 2.8. Should get the sort ascending for id column
// 2.9. Should get the sort desc for id column
// 2.10. Should get the changed width for id column
// 2.11. Should get the new position for id column in grid
// 2.12. Should get the media items as a list
// 2.13. Should get the media items as a cards
// 2.14. Should get selected two media items

import { browser, by, element, protractor } from 'protractor';
import { logoutFromApp } from '../../../../tests/e2e/logout-helper';
import { loginToApp } from '../../../../tests/e2e/login-helper';

describe('(e2e) App Slick-grid(functional)', () => {

    beforeEach(() => {
        browser.get('./#/media');
    });

    function repetition(inputString = '') {
        let searchInput = browser.driver.findElement(by.css('.test-search-form-input'));
        searchInput.clear();

        browser.sleep(2000);

        if (inputString !== '') {
            searchInput.sendKeys(inputString);
        } else {
            searchInput.sendKeys('ix3');
        }
        browser.sleep(1000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.sleep(2000);
    }

    function checkCell(numbers, result) {
        let cell = browser.driver.findElement(
          by.css('.slick-pane-right .slick-header-column:nth-child(' +
            numbers + ') .slick-column-name'));
        expect(cell.getText()).toBe(result);
        browser.sleep(1000);
    }

    it('(e2e) 0. Should get the login', () => {
        loginToApp();
    });

    it('(e2e) 1. Should get the array found media items', () => {
        browser.sleep(2000);

        repetition();

        let bodyGrid = browser.driver.findElement(
            by.css('media .slick-viewport-top .grid-canvas-right'));

        bodyGrid.findElements(by.css('.slick-row')).then(function(value) {
            let leng = value.length;
            expect(leng).not.toBe(0);
        });
    });

    it('(e2e) 2. Should get the div with text No result found', () => {
        browser.sleep(2000);

        repetition('my city');

        let noResult = browser.driver.findElement(by.css('.overlay-indicator'));
        expect(noResult.isDisplayed()).toBe(true);
    });

    it('(e2e) 3. Should get the second page(Click on number)', () => {
        browser.sleep(2000);

        repetition();

        let secondPage = browser.driver.findElement(by.css('.slick-page-2'));
        secondPage.click();

        expect(secondPage.getAttribute('class')).toContain('active');
    });

    it('(e2e) 4. Should get the second page(Click on button next page)', () => {
        browser.sleep(2000);

        repetition();

        let nextPage = browser.driver.findElement(by.css('media .icons-right'));
        nextPage.click();

        browser.sleep(2000);

        let secondPage = browser.driver.findElement(by.css('.slick-page-2'));
        secondPage.click();

        expect(secondPage.getAttribute('class')).toContain('active');
    });

    it('(e2e) 5. Should get the first page after select second page(Click on number)', () => {
        browser.sleep(2000);

        repetition();

        let secondPage = browser.driver.findElement(by.css('.slick-page-2'));
        secondPage.click();

        expect(secondPage.getAttribute('class')).toContain('active');

        browser.sleep(2000);

        let firstPage = browser.driver.findElement(by.css('.slick-page-1'));
        firstPage.click();

        expect(firstPage.getAttribute('class')).toContain('active');
    });

    it('(e2e) 6. Should get the first page after' +
    ' select second page(Click on button previous page)', () => {
        browser.sleep(2000);

        repetition();

        let nextPage = browser.driver.findElement(by.css('media .icons-right'));
        nextPage.click();

        let secondPage = browser.driver.findElement(by.css('.slick-page-2'));
        expect(secondPage.getAttribute('class')).toContain('active');

        browser.sleep(2000);

        let previousPage = browser.driver.findElement(by.css('media .icons-left'));
        previousPage.click();

        let firstPage = browser.driver.findElement(by.css('.slick-page-1'));
        expect(firstPage.getAttribute('class')).toContain('active');
    });

    it('(e2e) 7. Should get the last page(Click on button last page)', () => {
        browser.sleep(2000);

        repetition('i');

        let firstPage = browser.driver.findElement(by.css('.slick-page-1')).getText();

        let lastPage = browser.driver.findElement(by.css('media .icons-last'));
        lastPage.click();

        browser.sleep(2000);

        let activePage = browser.driver.findElement(by.css('.slick-pager .active a'));
        expect(activePage.getText()).not.toEqual(firstPage);
    });

    it('(e2e) 8. Should get the first page after' +
    ' click on last page(Click on button first page)', () => {
        browser.sleep(2000);

        repetition('i');

        let firstPage = browser.driver.findElement(by.css('.slick-page-1')).getText();

        let buttonLastPage = browser.driver.findElement(by.css('media .icons-last'));
        buttonLastPage.click();

        browser.sleep(2000);

        let activePage1 = browser.driver.findElement(by.css('.slick-pager .active a'));
        expect(activePage1.getText()).not.toEqual(firstPage);

        let buttonFirstPage = browser.driver.findElement(by.css('media .icons-first'));
        buttonFirstPage.click();

        let activePage2 = browser.driver.findElement(by.css('.slick-pager .active a'));
        expect(activePage2.getText()).toEqual(firstPage);
    });

    it('(e2e) 9. Should get the sort ascending for id column', () => {
        browser.sleep(2000);

        repetition();

        let idColumn = browser.driver.findElement(
            by.css('media .slick-header-right .slick-header-column:nth-child(1)'));
        idColumn.click();

        browser.sleep(2000);

        let firstRow = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(1) div:nth-child(1)'));

        let secondRow = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(2) div:nth-child(1)'));

        let first;
        let second;
        firstRow.getText().then((value1) => {
            first = parseInt(value1, 0);
            secondRow.getText().then((value2) => {
                second = parseInt(value2, 0);
                expect((second > first)).toBe(true);
            });
        });
    });

    it('(e2e) 10. Should get the sort desc for id column', () => {
        browser.sleep(2000);

        repetition();

        let idColumn = browser.driver.findElement(
            by.css('media .slick-header-right .slick-header-column:nth-child(1)'));
        idColumn.click();

        browser.sleep(2000);

        idColumn.click();

        browser.sleep(2000);

        let firstRow = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(1) div:nth-child(1)'));

        let secondRow = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(2) div:nth-child(1)'));

        let first;
        let second;
        firstRow.getText().then((value1) => {
            first = parseInt(value1);
            secondRow.getText().then((value2) => {
                second = parseInt(value2);
                expect((second < first)).toBe(true);
            });
        });
    });

    it('(e2e) 11. Should get the changed width for id column', () => {
        browser.sleep(2000);

        repetition();

        browser.sleep(2000);

        let resizeDiv = browser.driver.findElement(
            by.css('media .slick-header-column:nth-child(1) .slick-resizable-handle'));

        let idColumn = browser.driver.findElement(
          by.css('media .slick-header-right .slick-header-column:nth-child(1)'));

        let width;
        idColumn.getCssValue('width').then((value) => {
            width = value;
        });

        browser.actions().mouseDown(resizeDiv)
                .mouseMove({x: 300, y: 300}).mouseUp(resizeDiv).perform();

        browser.sleep(2000);

        idColumn.getCssValue('width').then((value) => {
            expect(width).not.toEqual(value);
            width = value;
        });

        let row = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(1) div:nth-child(1)'));
        row.getCssValue('width').then((value) => {
            expect(width).toEqual(value);
        });
    });

    it('(e2e) 12. Should get the new position for id column in grid', () => {
        browser.sleep(2000);

        repetition();

        checkCell(1, 'ID');
        checkCell(2, 'Title');

        let rowBefore = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(1) div:nth-child(1)'));
        let textRow = rowBefore.getText();

        let headerDiv = browser.driver.findElement(
            by.css('media .slick-header-right .slick-header-column:nth-child(1)'));

        browser.actions().mouseDown(headerDiv)
                .mouseMove({x: 100, y: 100}).mouseUp(headerDiv).perform();

        browser.sleep(2000);

        checkCell(1, 'Title');
        checkCell(2, 'ID');

        let rowAfter = browser.driver.findElement(
            by.css('media .grid-canvas-right .slick-row:nth-child(1) div:nth-child(2)'));
        expect(textRow).toEqual(rowAfter.getText());
    });

    it('(e2e) 13. Should get the media items as a list', () => {
        browser.sleep(2000);

        repetition();

        browser.sleep(2000);

        let divsList = browser.driver.findElement(
            by.css('media .grid-canvas-top.grid-canvas-right'));
        divsList.findElements(by.css('.slick-row')).then((value) => {
            expect(value.length).not.toEqual(0);
        });

        let tilesMode = browser.driver.findElement(by.css('.icons-tiles'));
        tilesMode.click();

        browser.sleep(2000);

        divsList.findElements(by.css('slick-row')).then((value) => {
            expect(value.length).toEqual(0);
        });
    });

    it('(e2e) 14. Should get the media items as a cards', () => {
        browser.sleep(2000);

        repetition();

        browser.sleep(2000);

        let tilesMode = browser.driver.findElement(by.css('.icons-tiles'));
        tilesMode.click();

        browser.sleep(2000);

        let divsTiles = browser.driver.findElement(
            by.css('media .grid-canvas-top.grid-canvas-left'));
        divsTiles.findElements(by.css('.slick-row')).then((value) => {
            expect(value.length).not.toEqual(0);
        });

        let gridMode = browser.driver.findElement(by.css('.icons-list'));
        gridMode.click();

        divsTiles.findElements(by.css('.slick-row')).then((value) => {
            expect(value.length).not.toEqual(0);
        });
    });

    it('(e2e) 15. Should get selected two media items', () => {
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
        browser.actions().keyUp(protractor.Key.CONTROL).perform();
        browser.actions().keyUp(protractor.Key.SHIFT).perform();

        browser.sleep(1000);

        let selectedFirstRow = browser.driver.findElement(
            by.css('.grid-canvas-top.grid-canvas-right .slick-row:nth-child(1) .l4'));
        let selectedSecondRow = browser.driver.findElement(
            by.css('.grid-canvas-top.grid-canvas-right .slick-row:nth-child(1) .l4'));

        expect(selectedFirstRow.getCssValue('background')).toEqual(
          'rgb(42, 140, 234) none repeat scroll 0% 0% / auto padding-box border-box');
        expect(selectedSecondRow.getCssValue('background')).toEqual('' +
          'rgb(42, 140, 234) none repeat scroll 0% 0% / auto padding-box border-box');

        logoutFromApp();
    });

    xit('(e2e) 16. Should get modal after drag row on item from tree', () => {
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

        let btnSchedules = browser.driver.findElement(
            by.css('.row-header nav:nth-child(4) li:nth-child(3) button'));
        btnSchedules.click();

        browser.sleep(2000);

        let astro = browser.driver.findElement(by.css('.ui-fancytree li:nth-child(1)'));
        let drag = browser.driver.findElement(
            by.css('.slick-row:nth-child(1) dragdrop-formatter-comp .drag-drop'));
        browser.actions()
                .mouseDown(drag)
                .mouseMove(astro)
                .mouseUp(drag).perform();

        browser.sleep(2000);

        let modal = browser.driver.findElement(by.css('wf-appointment-component .appointment'));
        expect(modal.isDisplayed()).toBe(true);

        let btnCancel = browser.driver.findElement(by.css('wf-appointment-component .primary'));
        btnCancel.click();

        browser.sleep(2000);

        logoutFromApp();
    });
});
