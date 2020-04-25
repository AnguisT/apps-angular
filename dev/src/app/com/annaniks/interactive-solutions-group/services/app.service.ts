import { Injectable } from "@angular/core";

@Injectable()
export class AppService {
    public isOpen: boolean = false;
    public menuIconVisiblity: boolean = false;
    /**
     * return boolean variable 
     * if isOpen is true,that menu open,else menu close 
     */
    public getVariable() {
        return this.isOpen;
    }

}