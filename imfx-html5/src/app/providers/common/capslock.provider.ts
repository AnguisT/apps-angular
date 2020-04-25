/**
 * Created by Sergey Trizna on 26.07.2017.
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class CapsLockProvider {
    public capsLockEnabled: boolean = false;
    public onCapsLockEnable: EventEmitter<any> = new EventEmitter<any>();

    public initCapsLockListener() {
        let body = $('body')
        if(!body){
            console.error('initCapsLockListener must be after initView. element body is not defined;');
            return false;
        }

        let self = this;
        $('body').addClass('capslock-listener');
        $('.capslock-listener').on('keydown', function (e) {
            if (e.which == 20 && self.capsLockEnabled !== null) {
                self.capsLockEnabled = !self.capsLockEnabled;
                self.onCapsLockEnable.emit({event: e, state: self.capsLockEnabled});
            } else if (e.which == 20) {
                // console.log("Keydown. Initial state not set.");
            }
        });

        $('.capslock-listener').on('keypress', function (e) {
            let str = String.fromCharCode(e.which);
            if (!str || str.toLowerCase() === str.toUpperCase()) {
                return;
            }
            self.capsLockEnabled = (str.toLowerCase() === str && e.shiftKey) || (str.toUpperCase() === str && !e.shiftKey);
            self.onCapsLockEnable.emit({event: e, state: self.capsLockEnabled});
        });
    }

    public destroyCapsLockListener() {
        $('.capslock-listener').off('keydown');
        $('.capslock-listener').off('keypress');
        $('body').removeClass('capslock-listener');
    }
}