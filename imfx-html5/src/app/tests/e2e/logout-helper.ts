/**
 * Created by dvvla on 08.02.2018.
 */

import { browser, by, element } from 'protractor';

export function logoutFromApp () {
    let profile = browser.driver.findElement(by.css('.user-btn'));
    browser.actions().mouseMove(profile).click().perform();

    browser.sleep(2000);

    let btnLogout = browser.driver.findElement(by.css('.logout'));
    btnLogout.click();
};
