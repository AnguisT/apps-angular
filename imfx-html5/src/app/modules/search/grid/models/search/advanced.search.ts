/**
 * Created by Sergey Trizna on 12.03.2017.
 */
import {Injectable} from '@angular/core';
import {SearchInterfaceModel} from './search.interface';

@Injectable()
/**
 * Advanced search
 */
export class AdvancedSearchModel implements SearchInterfaceModel {
    /**
     * Field of db
     */
    public _dbField: string;

    /**
     * Friendly name of db field
     */
    private _field: string;

    /**
     * Comparison operator
     */
    private _operation: string;

    /**
     * Group id for determination search params
     */
    private _groupId: string|number;

    /**
     * Value for search
     */
        // private _value: string|Array<any>;
    public _value: any;

    /**
     * Value for recent search
     */
    private _humanValue: any;

    // /**
    //  * All details
    //  */
    // private _detail: any;

    getDBField(): string {
        return this._dbField;
    }

    setDBField(value: string) {
        this._dbField = value;
    }

    getField(): string {
        return this._field;
    }

    setField(value: string) {
        this._field = value;
    }

    getOperation(): string {
        return this._operation;
    }

    setOperation(value: string) {
        this._operation = value;
    }

    getGroupId(): string|number {
        return this._groupId || 0;
    }

    setGroupId(value: string|number) {
        this._groupId = value;
    }

    getValue(): any {
        return this._value;
    }

    setValue(value: any) {
        this._value = value;
    }

    getHumanValue(): any {
        return this._humanValue;
    }

    setHumanValue(_humanValue: any) {
        this._humanValue = _humanValue;
    }

    getValueAsString(separator: string = '|') {
        return this.getValue() instanceof Array ? this.getValue().join(separator) : this.getValue();
    }

    fillByJSON(json) : AdvancedSearchModel {
        let m = new AdvancedSearchModel();
        m.setValue(json.Value);
        m.setDBField(json.DBField);
        m.setField(json.Field);
        m.setOperation(json.Operation);
        m.setGroupId(json.GroupId);

        return m;
    }

    /**
     * @inheritDoc
     */
    toRequest(): any {
        return {
            DBField: this.getDBField(),
            Field: this.getField(),
            HumanValue: this.getHumanValue(),
            Operation: this.getOperation(),
            GroupId: this.getGroupId(),
            Value: this.getValueAsString()
        };
    }

    toRestore() {
        let m = this.toRequest();
        m._fullModel = this;

        return m;
    }

    /**
     * @inheritDoc
     */
    fillModel(data): void {
        this.setDBField(data._dbField);
        this.setField(data._field);
        this.setOperation(data._operation);
        this.setGroupId(data._groupId);
        this.setValue(data._value);
        this.setHumanValue(data._humanValue);
    }

    /**
     * @inheritDoc
     */
    isValid(): boolean {
        return true;
    }
}
