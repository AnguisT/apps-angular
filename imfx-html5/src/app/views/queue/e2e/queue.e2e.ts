/**
 * Created by initr on 06.12.2016.
 */

import { browser, by, element } from 'protractor';

xdescribe('(e2e) App Media', () => {

    beforeEach(() => {
        browser.get('./#/queues');
    });


    xit('(e2e) Should get search results ', function() {
        browser.sleep(2000);
        let searchString = 'ix3';
        let searchInput = element(by.css('.test-search-form.test-search-form-input'));
        let btn = element(by.css('.test-search-form.test-search-form-btn'));

        searchInput.clear();
        searchInput.sendKeys(searchString);

        btn.click();
        browser.sleep(2000);
        let rows = element(by.css('.ag-body.ag-row'));

        expect(rows).not.toBe([]);
    });
    //
    // it('should have <home>', () => {
    // element(by.model('user')).sendKeys('jacksparrow');
    // question.sendKeys("What is the purpose of meaning?");
    // button.click();
    // expect(answer.getText()).toEqual("Chocolate!");
    //     let subject = element(by.css('app home')).isPresent();
    //     let result  = true;
    //     expect(subject).toEqual(result);
    // });
    //
    // it('should have buttons', () => {
    //     let subject = element(by.css('button')).getText();
    //     let result  = 'Submit Value';
    //     expect(subject).toEqual(result);
    // });

});
