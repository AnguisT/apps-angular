/**
 * Created by Sergey Trizna on 24.03.2017.
 */
// https://davidwalsh.name/javascript-debounce-function

import {Injectable} from '@angular/core';

@Injectable()
export class DebounceProvider {

    public debounce(func:Function, wait:number, immediate?:boolean) {
        let timeout;
        return (...args) => {
            // let context = this;
            let later = function () {
                timeout = null;
                if (!immediate) func(args[0]);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(args[0]);
        };
    };
}
