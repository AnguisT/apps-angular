/**
 * Created by Sergey Klimenko on 11.04.2017.
 */

import { browser, by, element } from 'protractor';

xdescribe('(e2e) App Dashboard', () => {

  beforeEach(() => {
    browser.get('./#/dashboard');
  });


  xit('(e2e) Should Add boards and change names ', function() {
    browser.sleep(3000);
    element(by.className('toggler')).click();
    browser.sleep(500);
    testChartBoard();
    testWFBoard();
  });

  function testWFBoard() {

  }

  function testChartBoard() {
    let target = element(by.id('layout'));
    let el = element(by.id('chart-drag'));
    browser.actions().dragAndDrop(el, target).perform();
    browser.sleep(5000);
    let controls = element(by.css('.controls-wrapper'));
    let title = controls.element(by.css('input[data-key="boardName"]'));
    title.clear();
    title.sendKeys('Chart for test');
    let buttons = controls.element(by.css('input[data-key="showChartButtons"]'));
    buttons.click();
    let axis1 = element.all(by.css('input[data-key="chartAxisNames"]')).get(0);
    axis1.clear();
    axis1.sendKeys('Axis - 1');
    let axis2 = element.all(by.css('input[data-key="chartAxisNames"]')).get(1);
    axis2.clear();
    axis2.sendKeys('Axis - 2');

    let type = element.all(by.css('div[data-key="selectedChartType"] select option'))
      .get(1).click();

    let saveBtn = controls.element(by.className('save-btn'));
    saveBtn.click();
    browser.sleep(3000);
    let newHeader = element(by.css('.chart-header')).getText();
    expect(newHeader).toBe('Chart for test');
  }

});
