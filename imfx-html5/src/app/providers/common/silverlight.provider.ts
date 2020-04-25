/**
 * Created by Sergey Trizna on 11.08.2017.
 */
import {Injectable} from "@angular/core";

@Injectable()
export class SilverlightProvider {

    private _isSilverlightInstalled: boolean = false;
    get isSilverlightInstalled(): boolean {
      return this._isSilverlightInstalled;
    }
    constructor() {
      let isSilverlightInstalled = false;
      try {
        //check on IE
        try {
          let slControl = new ActiveXObject('AgControl.AgControl');
          isSilverlightInstalled = true;
        } catch (e) {
          //either not installed or not IE. Check Firefox
          if (navigator.plugins["Silverlight Plug-In"]) {
            isSilverlightInstalled = true;
          }
        }
      } catch (e) {
      }

      this._isSilverlightInstalled = isSilverlightInstalled;
    }

}
