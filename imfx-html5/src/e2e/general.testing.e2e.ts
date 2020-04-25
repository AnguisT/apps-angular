/**
 * Created by dvvla on 07.08.2017.
 */

import { browser, by, element, protractor } from 'protractor';
import { loginToApp } from '../app/tests/e2e/login-helper';
import { logoutFromApp } from '../app/tests/e2e/logout-helper';

let EC = protractor.ExpectedConditions;

describe('(e2e) General Testing', () => {
    beforeEach(() => {
        browser.get('./#/media');
    });

    it('(e2e) 0. Should get login system', () => {
        browser.wait(EC.visibilityOf(element(by.id('login-submit'))), 10000).then(function () {
            loginToApp();

            browser.sleep(5000);
        });
    });

    // 1. You should be on media search screen by default
    it('(e2e) 1. Should get page media', () => {
        let media = browser.driver.findElement(by.css('media'));

        expect(media.isDisplayed()).toBe(true);
    });

    function checkCell(numbers, result) {
        let cell = browser.driver.findElement(
          by.css('.slick-pane-right .slick-header-column:nth-child(' + numbers + ') .slick-column-name'));
        expect(cell.getText()).toBe(result);
        browser.sleep(1000);
    }

    // 2. Make a new view for media search setup columns and save as
    it('(e2e) 2. Should get a new view for media search', () => {
        browser.sleep(2000);

        let dropdown = browser.driver.findElement(by.css('.test-search-settings-li-dropdown'));
        browser.actions().mouseMove(dropdown).click().perform();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(1)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        // browser.actions().mouseMove(dropdown).click().perform();
		//
        // browser.sleep(2000);
		//
        // let selectLi2 = browser.driver.findElement(
        //   by.css('.test-search-settings-li-dropdown li:nth-child(8)'));
        // browser.actions().mouseMove(selectLi2).click().perform();

        let inputDate = browser.driver.findElement(
          by.css('.ms-search input'));
        browser.sleep(1000);
        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('id');

        let selectColumn1 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(3) input'));
        browser.actions().mouseMove(selectColumn1).click().perform();

        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('title');

        let selectColumn2 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(5) input'));
        browser.actions().mouseMove(selectColumn2).click().perform();

        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('duration');

        let selectColumn3 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(1) input'));
        browser.actions().mouseMove(selectColumn3).click().perform();

        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('created date');

        let selectColumn4 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(1) input'));
        browser.actions().mouseMove(selectColumn4).click().perform();

        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('aspect');

        let selectColumn5 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(1) input'));
        browser.actions().mouseMove(selectColumn5).click().perform();

        let buttonCancel = browser.driver.findElement(
          by.css('.setup-columns-modal .modal-footer .form-group:nth-child(4) button'));
        browser.actions().mouseMove(buttonCancel).click().perform();

        browser.sleep(2000);

        let thumbsButton = browser.driver.findElement(by.css('media .test-button-thumbs'));
        browser.actions().mouseMove(thumbsButton).click().perform();

        browser.sleep(2000);

        browser.actions().mouseMove(dropdown).click().perform();

        browser.sleep(2000);

        let selectLi3 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(3)'));
        browser.actions().mouseMove(selectLi3).click().perform();

        browser.sleep(2000);

        let titleView = browser.driver.findElement(
          by.id('modalPromptInput'));
        browser.sleep(1000);
        titleView.clear();

        browser.sleep(1000);

        titleView.sendKeys('GeneralTest');

        browser.sleep(1000);

        let buttonSave = browser.driver.findElement(
          by.css('imfx-modal button.primary'));
        browser.actions().mouseMove(buttonSave).click().perform();

        browser.sleep(2000);

        browser.sleep(1000);

        checkCell(1, 'ID');
        checkCell(2, 'Title');
        checkCell(3, 'Duration');
        checkCell(4, 'Created Date');
        checkCell(5, 'Aspect');

        let spanSelect = browser.driver.findElement(
          by.css('media search-views .select2-selection__rendered'));
        expect(spanSelect.getText()).toBe('GeneralTest');

        browser.actions().mouseMove(dropdown).click().perform();

        let selectLi4 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(6)'));
        browser.actions().mouseMove(selectLi4).click().perform();

        browser.sleep(1000);

        let btnOk = browser.driver.findElement(
          by.css('imfx-modal button.primary'));
        browser.actions().mouseMove(btnOk).click().perform();
    });

    // 3. Media search for ix3
    it('(e2e) 3. Should get found ix3 in media search', () => {
        let inputSearch = browser.driver.findElement(by.css('.test-search-form-input'));
        inputSearch.clear();

        inputSearch.sendKeys('ix3');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        // browser.actions().mouseMove(btnSearch).click().perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        let div1 = browser.driver.findElement(
          by.css('media .slick-viewport-top .grid-canvas-right'));
        let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
            let leng = value.length;
            expect(leng).not.toBe(0);
        });
    });

    // 4. Put thumbnails on
    it('(e2e) 4. Should get thumbnails for every found element', () => {
        let inputSearch = browser.driver.findElement(by.css('.test-search-form-input'));
        inputSearch.clear();

        inputSearch.sendKeys('ix3');

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        let thumbs = browser.driver.findElement(by.css('.test-button-thumbs'));
        thumbs.click();

        browser.sleep(2000);

        let column = browser.driver.findElements(
          by.css('thumbnail-formatter-comp')).then(function(value) {
            let leng = value.length;
            expect(leng).not.toBe(0);
        });

        browser.sleep(2000);

        browser.actions().mouseMove(thumbs).click().perform();
    });

    function functionalSliders(numbers) {
        let slider = browser.driver.findElement(
          by.css('.ui-slider label:nth-child(' + numbers + ')'));
        browser.actions().mouseDown(slider).perform();

        browser.sleep(1500);

        browser.actions().mouseUp(slider).perform();
    }

    function functionalControlBar(block, numbers) {
        let buttonRewinding = browser.driver.findElement(
          by.css('.fbf-block:nth-child(' + block + ') div:nth-child(' + numbers + ')'));
        browser.actions().mouseMove(buttonRewinding).click().perform();
        browser.sleep(3000);
    }

    // 5. Watch some video. Play/pause, use the ff/rew bar
    it('(e2e) 5. Should get functional player', () => {
        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        browser.sleep(1000);
        inputSearch.clear();
        inputSearch.sendKeys('senate');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        // browser.sleep(2000);

        // browser.actions().mouseMove({x: 1, y: 1}).click().perform();

        browser.sleep(2000);

        let settings = browser.driver.findElement(
          by.css('media .slick-row:nth-child(3) settings-formatter-comp .icon'));
        settings.click();

        browser.sleep(2000);

        let selectSettings = browser.driver.findElement(
          by.css('.mediaSettingsPopup li:nth-child(2)'));
        selectSettings.click();

        browser.sleep(5000);

        let btnPlay1 = browser.driver.findElement(
          by.css('html-player button.large'));
        browser.actions().mouseMove(btnPlay1).click().perform();

        browser.sleep(2000);

        let volumMute = browser.driver.findElement(by.css('.vjs-vol-3'));
        browser.actions().mouseMove(volumMute).click().perform();

        browser.sleep(2000);

        let volumUnmute = browser.driver.findElement(by.css('.vjs-vol-0'));
        expect(volumUnmute.isDisplayed()).toBe(true);

        browser.sleep(1000);

        let btnFullscreen = browser.driver.findElement(
          by.id('fullscreen-btn'));
        browser.actions().mouseMove(btnFullscreen).click().perform();

        browser.sleep(15000);

        browser.actions().mouseMove(btnFullscreen).click().perform();

        browser.sleep(2000);

        // let time = browser.driver.findElement(by.css('.currentTimecode'));
        // let lastTime = time.getText();
        // expect(time.getText()).not.toBe('10\n:\n19\n:\n59\n:\n28');

        functionalSliders(2);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(3);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(4);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(5);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(7);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(8);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(9);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalSliders(10);
        // expect(time.getText()).not.toBe(lastTime);


        let btnPlay2 = browser.driver.findElement(
          by.css('html-player .sub-control-bar:nth-child(1) div.icon-button:nth-child(1)'));
        browser.actions().mouseMove(btnPlay2).click().perform();

        functionalControlBar(1, 1);
        // expect(time.getText()).toBe('10\n:\n19\n:\n59\n:\n28');
        // lastTime = time.getText();
        functionalControlBar(3, 3);
        // expect(time.getText()).toBe('11\n:\n20\n:\n01\n:\n25');
        // lastTime = time.getText();
        functionalControlBar(1, 2);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalControlBar(1, 3);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalControlBar(3, 1);
        // expect(time.getText()).not.toBe(lastTime);
        // lastTime = time.getText();
        functionalControlBar(3, 2);
        // expect(time.getText()).toBe('11\n:\n20\n:\n01\n:\n25');

        browser.sleep(2000);
    });

    // 6. resize the panels
    it('(e2e) 6. Should get resized the panel', () => {
        browser.sleep(2000);

        let btnAdvanced = browser.driver.findElement(by.css('.test-advanced-searching-button'));
        btnAdvanced.click();

        browser.sleep(2000);

        let splitGutter2 = browser.driver.findElement(
          by.xpath('/html/body/app/div/div/div/main/media/div/div[1]/div[2]/split/split-area[1]/split/split-gutter'));

        browser.sleep(2000);

        browser.actions().mouseDown(splitGutter2).mouseMove({x: 0, y: 100}).mouseUp(splitGutter2).perform();

        browser.sleep(2000);

        let splitGutter1 = browser.driver.findElement(
          by.xpath('/html/body/app/div/div/div/main/media/div/div[1]/div[2]/split/split-gutter'));

        browser.sleep(2000);

        browser.actions().mouseDown(splitGutter1).mouseMove({x: 100, y: 0}).mouseUp(splitGutter1).perform();

        browser.sleep(2000);

        btnAdvanced.click();
    });

    // 9. switch to grid view (top right)
    it('(e2e) 9. Should get switch to grid view', () => {
        let gridView = browser.driver.findElement(by.css('.row-header li:nth-child(4) button'));
        browser.actions().mouseMove(gridView).click().perform();

        let inputSearch = browser.driver.findElement(by.css('.test-search-form-input'));
        inputSearch.clear();

        inputSearch.sendKeys('ix3');

        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        browser.driver.findElements(
            by.css('thumbnail-formatter-comp')).then(function(value) {
            let leng = value.length;
            expect(leng).not.toBe(0);
        });
    });

    // 10. do facets search to narrow down results a little
    it('(e2e) 10. Should get do facets search', () => {
        let inputSearch = browser.driver.findElement(by.css('.test-search-form-input'));
        inputSearch.clear();

        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        browser.sleep(2000);

        let btnFacet = browser.driver.findElement(
          by.css('.row-header nav:nth-child(1) li:nth-child(3) button'));
        browser.actions().mouseMove(btnFacet).click().perform();

        browser.sleep(2000);

        let facetProgramme = browser.driver.findElement(
          by.xpath('//search-facets/div/div/div[2]/div[2]/div[1]/span[2]'));
        let lastProgramme = facetProgramme.getText();

        browser.sleep(2000);

        inputSearch.clear();

        inputSearch.sendKeys('senate');

        browser.sleep(2000);

        browser.actions().mouseMove(btnSearch).click().perform();

        browser.sleep(2000);

        let facetProgramme1 = browser.driver.findElement(
          by.xpath('//search-facets/div/div/div[2]/div[2]/div[1]/span[2]'));
        expect(facetProgramme1.getText()).not.toBe(lastProgramme);

        btnFacet.click();
    });

    // 11. Bring up advanced search – select and use a saved search
    it('(e2e) 11. Should get used a saved search in advanced search ', () => {
        let inputSearch = browser.driver.findElement(by.css('.test-search-form-input'));
        inputSearch.clear();

        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        browser.sleep(2000);

        let totalRecord1 = browser.driver.findElement(by.css('slickgrid-info-comp .wrapper-info'));
        let totalRecordLast = totalRecord1.getText();

        browser.sleep(2000);

        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {

            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();
        });

        let btnSelectSaved = browser.driver.findElement(
          by.css('#selectSavedSearch span.select2'));
        browser.actions().mouseMove(btnSelectSaved).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys('TEST').perform();
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        browser.actions().mouseMove(btnSearch).click().perform();

        browser.sleep(5000);

        let totalRecord2 = browser.driver.findElement(by.css('slickgrid-info-comp .wrapper-info'));
        expect(totalRecord2.getText()).not.toBe(totalRecordLast);
    });

    function mediaType(media, numbers) {
        let selectData = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2'));
        browser.actions().mouseMove(selectData).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys(media).perform();
        browser.sleep(1000);
        if (numbers === 1) {
            browser.actions().sendKeys(protractor.Key.ENTER).perform();
        } else if (numbers === 3) {
            let selectLi1 = browser.driver.findElement(
              by.css('ul.select2-results__options li:nth-child(3)'));
            browser.actions().mouseMove(selectLi1).click().perform();
        }
        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        browser.sleep(2000);

        let settings = browser.driver.findElement(
          by.css('media .slick-row:nth-child(1) settings-formatter-comp .icon'));
        settings.click();

        browser.sleep(2000);

        let selectSettings = browser.driver.findElement(
          by.css('.mediaSettingsPopup li:nth-child(2)'));
        selectSettings.click();

        browser.sleep(4000);

        let btnBack = browser.driver.findElement(
          by.css('.imfx-detail-btns li:nth-child(1) button'));
        browser.actions().mouseMove(btnBack).click().perform();

        browser.sleep(2000);
    };

    // 12. Find an look at different type of media h264,webm,dash view images bmp/gif/jpg etc, view pdf and xml documents
    it('(e2e) 12. Should get found at different type of media ', () => {
        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();
        browser.sleep(1000);

        browser.actions().sendKeys('Media Type').perform();
        browser.sleep(1000);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        mediaType('Audio Media File', 1);
        browser.sleep(2000);
        mediaType('File Document', 1);
        browser.sleep(2000);
        mediaType('Media File', 3);
        browser.sleep(2000);
    });

    // 13. Use the recent searches functionality
    it('(e2e) 13. Should get used the recent searches', () => {
        let btnAdvanced = browser.driver.findElement(by.css('.test-advanced-searching-button'));
        btnAdvanced.click();

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();

        browser.sleep(2000);

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();
        browser.sleep(2000);
        browser.actions().sendKeys('Media Type').perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        let selectData = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2'));
        browser.actions().mouseMove(selectData).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys('Media File').perform();

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(3)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(by.css('.test-search-form-btn'));
        btnSearch.click();

        let btnClear = browser.driver.findElement(by.css('.test-advanced-searching-button-clear'));
        btnClear.click();

        browser.sleep(2000);

        let recentSearches = browser.driver.findElement(by.css('.recents div:nth-child(1)'));
        recentSearches.click();

        browser.sleep(3000);

        let selectParameter1 = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        expect(selectParameter1.getText()).toBe('Media Type');

        let selectData1 = browser.driver.findElement(
          by.css('advanced-criteria-control-combosingle span.select2'));
        expect(selectData1.getText()).toBe('Media File');

        btnAdvanced.click();
    });

    // 19. Double click into media details
    // a. move the tabs (underneath video player) around
    // b. look at metadata tab (media id 65224 has some metadata already there.)
    it('(e2e) 19. Should get page details for selected media file', () => {
      browser.wait(EC.elementToBeClickable(element(
          by.css('.test-advanced-searching-button'))), 10000).then(() => {

          browser.sleep(4000);

          let inputSearch = browser.driver.findElement(
            by.css('.test-search-form-input'));
          inputSearch.clear();
          inputSearch.sendKeys('senate');

          browser.sleep(2000);

          browser.actions().sendKeys(protractor.Key.ENTER).perform();

          browser.sleep(4000);

          let advanceButton = browser.driver.findElement(
            by.css('.test-advanced-searching-button'));
          advanceButton.click();

          browser.sleep(2000);

          let btnSelectSaved = browser.driver.findElement(
            by.css('#selectSavedSearch span.select2'));
          browser.actions().mouseMove(btnSelectSaved).click().perform();

          browser.sleep(2000);

          browser.actions().sendKeys('TEST').perform();
          browser.sleep(2000);
          browser.actions().sendKeys(protractor.Key.ENTER).perform();

          browser.sleep(2000);

          let advInput = browser.driver.findElement(
            by.css('imfx-controls-number .field'));
          advInput.clear();

          browser.sleep(2000);

          advInput.sendKeys('66375');

          browser.sleep(2000);

          let btnSearch = browser.driver.findElement(
            by.css('.test-search-form-btn'));
          btnSearch.click();

          browser.sleep(5000);

          advanceButton.click();

          browser.sleep(2000);

          let settings = browser.driver.findElement(
            by.css('media .slick-row:nth-child(1) settings-formatter-comp .icon'));
          settings.click();

          browser.sleep(2000);

          let selectSettings = browser.driver.findElement(
            by.css('.mediaSettingsPopup li:nth-child(2)'));
          selectSettings.click();

          browser.sleep(2000);

          let tab = browser.driver.findElement(
            by.xpath('//*[@id="layout"]/div/div/div[1]/div[1]/ul[1]/li/span'));
          browser.actions().mouseDown(tab).mouseMove({x: 400, y: 200}).mouseUp().perform();

          browser.sleep(2000);

          let metadata1 = browser.driver.findElement(
            by.css('.simple-tree-wrapper div:nth-child(1) .dock-item-row'));
          browser.actions().mouseMove(metadata1).click().perform();

          browser.sleep(1000);

          let xmlTree = browser.driver.findElement(by.css('tree-root'));
          expect(xmlTree.isDisplayed()).toBe(true);
      });
  });

    // 14. Switch to dark theme (top right)
    it('(e2e) 14. Should get to dart theme', () => {
        let profile = browser.driver.findElement(by.css('.user-btn'));
        browser.actions().mouseMove(profile).click().perform();

        browser.sleep(2000);

        let topicDark = browser.driver.findElement(
          by.css('profile-colorschemas div:nth-child(2) input'));
        topicDark.click();

        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        browser.actions().mouseMove(profile).click().perform();

        browser.sleep(2000);

        let topicDefault = browser.driver.findElement(
          by.css('profile-colorschemas div:nth-child(1) input'));
        topicDefault.click();

        browser.sleep(2000);
    });

    // 15. Log out (top right)
    it('(e2e) 15. Should get page login', () => {
        let profile = browser.driver.findElement(by.css('.user-btn'));
        browser.actions().mouseMove(profile).click().perform();

        browser.sleep(2000);

        let btnLogout = browser.driver.findElement(by.css('.logout'));
        btnLogout.click();

        browser.sleep(2000);

        let loginForm = browser.driver.findElement(by.css('.test-login-form'));
        expect(loginForm.isDisplayed()).toBe(true);

        loginToApp();
    });

    function switcherLanguages(lang) {
        let classLang = '.test-lang-' + lang;
        let subject = browser.driver.findElement(by.css('.test-login-prompt'));
        let selector = browser.driver.findElement(by.css('.test-lang-switcher-dropdown'));

        browser.sleep(2000).then(() => {
          browser.actions().mouseMove(selector).click().perform();
        });

        browser.sleep(2000).then(() => {
          let elem = browser.driver.findElement(by.css(classLang));
          browser.actions().mouseMove(elem).click().perform();
        });
    };

    function login() {
        let username = 'vladd';
        let password = 'vladd';
        let elUsername = browser.driver.findElement(by.id('login-username'));
        let elPassword = browser.driver.findElement(by.id('login-password'));
        let btn = browser.driver.findElement(by.id('login-submit'));

        elUsername.clear();
        elUsername.sendKeys(username);
        elPassword.clear();
        elPassword.sendKeys(password);

        browser.sleep(2000).then(() => {
          browser.actions().mouseMove(btn).click().perform();
        });
    };

    // 16. Change language at bottom then log in again
    it('(e2e) 16. Should get modified language in site', () => {
        let menuTextUK = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[1]/ul/li/a'));
        expect(menuTextUK.getText()).toBe('Media');

        let profile = browser.driver.findElement(by.css('.user-btn'));
        browser.actions().mouseMove(profile).click().perform();

        browser.sleep(2000);

        let btnLogout = browser.driver.findElement(by.css('.logout'));
        btnLogout.click();

        browser.sleep(2000);

        switcherLanguages('ru-RU');

        browser.sleep(2000);

        login();

        browser.sleep(4000);

        let menuTextRUS = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[1]/ul/li/a'));
        expect(menuTextRUS.getText()).toBe('Медиа');

        let profile1 = browser.driver.findElement(by.css('.user-btn'));
        browser.actions().mouseMove(profile1).click().perform();

        browser.sleep(2000);

        let btnLogout1 = browser.driver.findElement(by.css('.logout'));
        btnLogout1.click();

        browser.sleep(2000);

        switcherLanguages('en-GB');

        browser.sleep(2000);

        login();
    });

    let lastTime;
    function selectClosedCaption(numbers) {
        let row = browser.driver.findElement(
          by.css(`subtitles-grid .slick-pane-top.slick-pane-right .slick-row:nth-child(${numbers})`));
          // by.css('subtitles-grid .ag-body-container .ag-row:nth-child(' + numbers + ')'));
        browser.actions().mouseMove(row).click().perform();

        browser.sleep(2000);

        let time = browser.driver.findElement(by.css('.currentTimecode'));
        expect(time.getText()).not.toBe(lastTime);
        lastTime = time.getText();

        browser.sleep(2000);
    }

    // 17. Media search for senate watch the video with the closed captions display underath (id 66375)
    it('(e2e) 17. Should get datails for selected video', () => {
        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();

        browser.sleep(2000);

        inputSearch.sendKeys('senate');

        browser.sleep(2000);

        browser.wait(EC.elementToBeClickable(element(
            by.css('.test-advanced-searching-button'))), 10000).then(() => {

            browser.sleep(4000);

            let advanceButton = browser.driver.findElement(
              by.css('.test-advanced-searching-button'));
            advanceButton.click();

            browser.sleep(2000);

            let btnSelectSaved = browser.driver.findElement(
              by.css('#selectSavedSearch span.select2'));
            browser.actions().mouseMove(btnSelectSaved).click().perform();

            browser.sleep(2000);

            browser.actions().sendKeys('TEST').perform();
            browser.sleep(2000);
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            let advInput = browser.driver.findElement(
              by.css('imfx-controls-number .field'));
            advInput.clear();

            browser.sleep(2000);

            advInput.sendKeys('66375');

            browser.sleep(2000);

            let btnSearch = browser.driver.findElement(
              by.css('.test-search-form-btn'));
            browser.actions().mouseMove(btnSearch).click().perform();

            browser.sleep(2000);

            let row = browser.driver.findElement(
              by.css('media .slick-viewport-top .grid-canvas-right .slick-row:nth-child(1)'));
            row.click();

            let btnInfo = browser.driver.findElement(
              by.css('.row-header nav:nth-child(2) li:nth-child(6) button'));
            browser.actions().mouseMove(btnInfo).click().perform();

            // let time = browser.driver.findElement(by.css('.currentTimecode'));

            // browser.wait(EC.textToBePresentInElement(
            //   element(by.css('.currentTimecode')), '09\n:\n49\n:\n59\n:\n57'), 10000)
            // .then(function(){
            //   // success
            //   expect(time.getText()).toBe('09\n:\n49\n:\n59\n:\n57');
            //   lastTime = time.getText();
            // }, function(error) {
            //   // failed...
            // });

            browser.sleep(2000);

            let btnTab = browser.driver.findElement(
              by.css('.detail-sub-tabs-header div:nth-child(2) span'));
            // browser.actions().mouseMove()
            btnTab.click();

            browser.sleep(5000);

            selectClosedCaption(2);
            selectClosedCaption(3);
            // selectClosedCaption(3);
            // selectClosedCaption(4);
            // selectClosedCaption(10);
            // selectClosedCaption(11);

            browser.sleep(2000);

            browser.actions().mouseMove(btnInfo).click().perform();

            browser.sleep(2000);

            advanceButton.click();
        });
    });

    // 18. Untick show info or Twirl up all the extra metadata bottom right to extend captions display
    // it('(e2e) 18. Should get modified current time for ever selected caption', () => {
    //     let inputSearch = browser.driver.findElement(
    //       by.css('.test-search-form-input'));
    //     inputSearch.clear();
    //     inputSearch.sendKeys('senate');

    //     browser.sleep(2000);

    //     let btnSearch = browser.driver.findElement(
    //       by.css('.test-search-form-btn'));
    //     btnSearch.click();

    //     browser.sleep(2000);

    //     let row = browser.driver.findElement(
    //       by.css('media .slick-viewport-top .grid-canvas-right .slick-row:nth-child(2)'));
    //     browser.actions().mouseMove(row).click().perform();

    //     browser.sleep(2000);

    //     let btnInfo = browser.driver.findElement(
    //       by.css('.row-header nav:nth-child(4) li:nth-child(6) button'));
    //     browser.actions().mouseMove(btnInfo).click().perform();

    //     browser.sleep(2000);

    //     let showInfo = browser.driver.findElement(by.css('.show-accordions-checkbox input'));
    //     browser.actions().mouseMove(showInfo).click().perform();

    //     browser.sleep(2000);

    //     let accordionBlock = browser.driver.findElement(
    //       by.css('.panel .card'));
    //     expect(accordionBlock.isDisplayed()).toBe(true);

    //     browser.sleep(2000);

    //     let showInfo1 = browser.driver.findElement(by.css('.show-accordions-checkbox input'));
    //     browser.actions().mouseMove(showInfo1).click().perform();

    //     browser.actions().mouseMove(btnInfo).click().perform();
    // });

    // function updatePage(numbers) {
    //     let profile = browser.driver.findElement(by.css('.user-btn'));
    //     browser.actions().mouseMove(profile).perform();
	//
    //     browser.sleep(2000);
	//
    //     let btnProfile = browser.driver.findElement(by.css('.additional button'));
    //     browser.actions().mouseMove(btnProfile).click().perform();
	//
    //     let menuSidebar = browser.driver.findElement(by.css('.nav-sidebar li:nth-child(3) a'));
    //     browser.actions().mouseMove(menuSidebar).click().perform();
	//
    //     let selectPage = browser.driver.findElement(by.css('profile-defaultpage span.select2'));
    //     browser.actions().mouseMove(selectPage).click().perform();
	//
    //     let selectLi = browser.driver.findElement(
    //       by.css('ul.select2-results__options li:nth-child(' + numbers + ')'));
    //     browser.actions().mouseMove(selectLi).click().perform();
	//
    //     browser.actions().mouseMove(profile).perform();
	//
    //     browser.sleep(2000);
    // }
    // 20. Go to your profile (top right) and change your default start page
    // it('(e2e) 20. Should get modified default page', () => {
    //     browser.sleep(3000);
	//
    //     let menuTextMedia = browser.driver.findElement(
    //       by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[1]/a'));
    //     expect(menuTextMedia.getText()).toBe('Media');
	//
    //     updatePage(7);
	//
    //     let btnLogout = browser.driver.findElement(by.css('.logout'));
    //     btnLogout.click();
	//
    //     browser.sleep(2000);
	//
    //     login();
	//
    //     browser.sleep(3000);
	//
    //     let menuTextSimpli = browser.driver.findElement(
    //       by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[1]/a'));
    //     expect(menuTextSimpli.getText()).toBe('Simplified');
	//
    //     updatePage(6);
    // });

    // 21. Title search
    it('(e2e) 21. Should get title search', () => {
        let menu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/a'));
        browser.actions().mouseMove(menu).click().perform();

        browser.sleep(1000);

        let selectedMenu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/ul/li[2]/a'));
        browser.actions().mouseMove(selectedMenu).click().perform();

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

        let searchTitle = browser.driver.findElement(
          by.css('.test-titles-search-table .slick-viewport-top .grid-canvas .slick-row:nth-child(1)'));
        browser.actions().mouseMove(searchTitle).click().perform();

        browser.sleep(2000);

        expect(searchTitle.isDisplayed()).toBe(true);

        let searchVersion = browser.driver.findElement(
          by.css('versions-inside-titles .slick-viewport-top .grid-canvas .slick-row:nth-child(1)'));
        browser.actions().mouseMove(searchVersion).click().perform();

        browser.sleep(2000);

        expect(searchVersion.isDisplayed()).toBe(true);

        let searchMedia = browser.driver.findElement(
          by.css('media-inside-titles .slick-viewport-top .grid-canvas .slick-row:nth-child(1)'));
        browser.actions().mouseMove(searchMedia).click().perform();

        browser.sleep(2000);

        expect(searchMedia.isDisplayed()).toBe(true);
    });

    // 22. Type black and wait a moment – list of suggested results would pop up underneath
    it('(e2e) 22. Should get list of suggested results', () => {
        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('black');

        browser.sleep(3000);

        let dialogSearch = browser.driver.findElement(by.css('.dialog-searchdropdown'));
        expect(dialogSearch.isDisplayed()).toBe(true);

        let selectLi = browser.driver.findElement(
          by.css('.angucomplete-column:nth-child(1) .angucomplete-row:nth-child(1)'));
        browser.actions().mouseMove(selectLi).click().perform();

        browser.sleep(1000);

        inputSearch.getAttribute('value').then(function(value) {
            expect(value).toBe('Black Bear');
        });
    });

    // 23. Create/modify views
    it('(e2e) 23. Should get modified views', () => {
        let selectView1 = browser.driver.findElement(by.css('media search-views span.select2'));
        browser.actions().mouseMove(selectView1).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys('TestForModifyTest').perform();

        browser.sleep(1000);

        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        checkCell(2, 'Loc. Status');
        checkCell(1, 'Location');

        let dropdown = browser.driver.findElement(by.css('.test-search-settings-li-dropdown'));
        browser.actions().mouseMove(dropdown).click().perform();

        let selectLi1 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(8)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        browser.sleep(2000);

        let inputDate = browser.driver.findElement(
          by.css('.ms-search input'));
        inputDate.clear();

        browser.sleep(1000);

        inputDate.sendKeys('id');

        let selectColumn1 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(3) input'));
        browser.actions().mouseMove(selectColumn1).click().perform();

        let buttonCancel = browser.driver.findElement(
          by.css('.setup-columns-modal .modal-footer .form-group:nth-child(4) button'));
        browser.actions().mouseMove(buttonCancel).click().perform();

        browser.sleep(2000);

        browser.actions().mouseMove(dropdown).click().perform();

        let selectLi2 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(2)'));
        browser.actions().mouseMove(selectLi2).click().perform();

        browser.sleep(2000);

        let selectView2 = browser.driver.findElement(by.css('media search-views span.select2'));
        browser.actions().mouseMove(selectView2).click().perform();

        browser.sleep(2000);

        let selectedView = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(1)'));
        browser.actions().mouseMove(selectedView).click().perform();

        browser.sleep(2000);

        let selectView3 = browser.driver.findElement(by.css('media search-views span.select2'));
        browser.actions().mouseMove(selectView3).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys('TestForModifyTest').perform();

        browser.sleep(1000);

        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        checkCell(2, 'Loc. Status');
        checkCell(1, 'Location');
        checkCell(3, 'ID');

        browser.actions().mouseMove(dropdown).click().perform();

        let selectLi3 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(8)'));
        browser.actions().mouseMove(selectLi3).click().perform();

        browser.sleep(2000);

        let inputDate1 = browser.driver.findElement(
          by.css('.ms-search input'));
        inputDate1.clear();

        browser.sleep(1000);

        inputDate1.sendKeys('id');

        let selectColumn2 = browser.driver.findElement(
          by.css('.js-scrollbar-target-modal-one div:nth-child(3) input'));
        browser.actions().mouseMove(selectColumn2).click().perform();

        let buttonCancel1 = browser.driver.findElement(
          by.css('.setup-columns-modal .modal-footer .form-group:nth-child(4) button'));
        browser.actions().mouseMove(buttonCancel1).click().perform();

        browser.sleep(2000);

        browser.actions().mouseMove(dropdown).click().perform();

        let selectLi4 = browser.driver.findElement(
          by.css('.test-search-settings-li-dropdown li:nth-child(2)'));
        browser.actions().mouseMove(selectLi4).click().perform();

        browser.sleep(2000);

        checkCell(2, 'Loc. Status');
        checkCell(1, 'Location');
    });

    // 24. Version search
    it('(e2e) 24. Should get version search', () => {
        let menu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/a'));
        browser.actions().mouseMove(menu).click().perform();

        browser.sleep(1000);

        let selectedMenu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/ul/li[3]/a'));
        browser.actions().mouseMove(selectedMenu).click().perform();

        browser.sleep(4000);

        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        browser.actions().mouseMove(btnSearch).click().perform();

        let div1 = browser.driver.findElement(
          by.css('version .slick-viewport-top .grid-canvas-right'));

        let rows1 = div1.findElements(by.css('.slick-row')).then(function(value) {
            let leng = value.length;
            if (leng === 0) {
                expect(value).toEqual([]);
            } else {
                expect(value).not.toEqual([]);
            };
        });

        browser.sleep(2000);

        btnSearch.click();
    });

    // 25. Simplified search (name will change soon)
    it('(e2e) 25. Should get simplified', () => {
        let menu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/a'));
        browser.actions().mouseMove(menu).click().perform();

        browser.sleep(1000);

        let selectedMenu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[3]/ul/li[5]/a'));
        browser.actions().mouseMove(selectedMenu).click().perform();

        browser.sleep(2000);

        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.driver.findElements(
          by.css('.simplified-item__row')).then(function(value) {
            let leng = value.length;
            if (leng === 0) {
                expect(value).toEqual([]);
            } else {
                expect(value).not.toEqual([]);
            };
        });

        let selectRow = browser.driver.findElement(
          by.css('.simplified-item__row:nth-child(1) .item-title'));
        browser.actions().mouseMove(selectRow).click().perform();

        browser.sleep(5000);

        let details = browser.driver.findElement(by.css('.sidebar-content'));
        expect(details.isDisplayed()).toBe(true);

        browser.sleep(2000);

        let btnSearch1 = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        btnSearch1.click();
    });

    // 26. Add to basket raise a work order (look for the ones named chameleon to get the additional drop down menus)
    it('(e2e) 26. Should get the additional drop down menus in basket for selected media file', () => {
        let basket = browser.driver.findElement(by.css('.basket-btn'));
        browser.actions().mouseMove(basket).click().perform();

        browser.actions().mouseMove(basket, {x: 1000, y: 1000}).perform();

        // let basketButton = browser.driver.findElement(
        //   by.css('media-basket-panel-component button.full-width'));
        // browser.actions().mouseMove(basketButton).click().perform();

        browser.sleep(3000);

        let selectPreset = browser.driver.findElement(
          by.css('.media-basket-order .padding-default:nth-child(2) span.select2'));
        browser.actions().mouseMove(selectPreset).click().perform();

        browser.sleep(2000);

        browser.actions().sendKeys('Chameleon work order - Deliver Media').perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        let settingsPreset = browser.driver.findElement(by.css('.preset-settings-wrapper'));
        expect(settingsPreset.isDisplayed()).toBe(true);
    });

    // 27. Go to apps/misr
    // a. search ix3
    // b. Add/modify/save views
    // c. Advanced search to narrow results down
    it('(e2e) 27. Should get misr search with used advanced search', () => {
        let menu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[5]/a'));

        browser.actions().mouseMove(menu).click().perform();

        browser.sleep(1000);

        let selectedMenu = browser.driver.findElement(
          by.xpath('/html/body/app/div/div[1]/nav/ul/li[2]/base-top-menu/ul/li[5]/ul/li[1]/a'));
        browser.actions().mouseMove(selectedMenu).click().perform();

        browser.sleep(2000);

        let inputSearch = browser.driver.findElement(
          by.css('.test-search-form-input'));
        browser.actions().mouseMove(inputSearch).click().perform();
        inputSearch.clear();
        inputSearch.sendKeys('ix3');

        browser.sleep(2000);

        let btnSearch = browser.driver.findElement(
          by.css('.test-search-form-btn'));
        btnSearch.click();

        browser.actions().mouseMove(inputSearch, {x: 1000, y: 1000}).click().perform();

        browser.sleep(2000);

        let advanceButton = browser.driver.findElement(
          by.css('.test-advanced-searching-button'));
        advanceButton.click();

        browser.sleep(2000);

        let btnAddGroup = browser.driver.findElement(
          by.css('.test-advanced-searching-button-add-group'));
        btnAddGroup.click();

        browser.sleep(2000);

        let selectParameter = browser.driver.findElement(
          by.css('advanced-criteria-field-builder span.select2'));
        browser.actions().mouseMove(selectParameter).click().perform();
        browser.sleep(2000);
        browser.actions().sendKeys('Status').perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        browser.sleep(2000);

        let selectData = browser.driver.findElement(
          by.css('advanced-criteria-control-combomulti .select2-selection__rendered'));
        selectData.click();

        browser.sleep(2000);

        let selectLi1 = browser.driver.findElement(
          by.css('ul.select2-results__options li:nth-child(2)'));
        browser.actions().mouseMove(selectLi1).click().perform();

        browser.sleep(2000);

        btnSearch.click();
    });
});
