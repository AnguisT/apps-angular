import {browser, element, protractor} from 'protractor';
import {By, WebElement} from "selenium-webdriver";

let EC = protractor.ExpectedConditions;
let waitingTime = 5000;

export function waitVisibility(el: By): Promise<WebElement> {
    return new Promise((resolve, reject) => {
        browser.driver.findElement(el).then((el: WebElement) => {
            resolve(el);
        }).catch(() => {
            browser.wait(EC.visibilityOf(element(el)), waitingTime).then(() => {
                resolve(element(el));
            }).catch((err) => {
                reject(err);
            });
        });
    });
}

export function waitVisibilityAndClick(el: By): Promise<WebElement> {
    return new Promise((resolve, reject) => {
        waitVisibility(el).then((el: WebElement) => {
            el.click()
            // browser.actions().mouseMove(el).click().perform();
        });
    });
}
