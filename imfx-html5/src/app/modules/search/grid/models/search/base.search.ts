/**
 * Created by Sergey Trizna on 12.03.2017.
 */
import {Injectable} from '@angular/core';
import {SearchInterfaceModel} from './search.interface';

@Injectable()
/**
 * Base search (just now it string at top of table)
 */
export class BaseSearchModel implements SearchInterfaceModel {
    private _value: string;

    getValue(): string {
        return this._value;
    }

    setValue(value: string) {
        this._value = value;
    }

    /**
     * @inheritDoc
     * @returns {string}
     */
    toRequest(): string {
        return this.getValue();
    }

    /**
     * @inheritDoc
     */
    isValid(): boolean {
        let val = this.getValue();
        return !!(val && val.length > 0 && typeof val == "string");
    }

}