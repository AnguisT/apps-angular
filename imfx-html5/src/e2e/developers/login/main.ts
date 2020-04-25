import {waitVisibility} from "../../../app/tests/e2e/common-helper";
import {by} from "protractor";
import {loginToApp} from "../../../app/tests/e2e/login-helper";

export function loginSimpleCase(){
    it('(e2e) 0. Should get login system', () => {
        waitVisibility(by.id('login-submit')).then(() => {
            loginToApp()
        })
    });
}
