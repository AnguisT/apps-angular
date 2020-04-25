/**
 * Created by Sergey Trizna on 13.04.2017.
 */
import { browser, by, element } from 'protractor';

export function loginToApp () {
    let username = 'vladd';
    let password = 'vladd';
    let elUsername = element(by.id('login-username'));
    let elPassword = element(by.id('login-password'));
    let btn = element(by.id('login-submit'));

    elUsername.clear();
    elUsername.sendKeys(username);
    elPassword.clear();
    elPassword.sendKeys(password);

    btn.click()
    // browser.sleep(2000).then(() => {
    //     browser.actions().mouseMove(btn).click().perform();
    // });
};
