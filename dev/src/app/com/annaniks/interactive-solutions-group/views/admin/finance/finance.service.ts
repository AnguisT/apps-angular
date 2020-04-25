import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class FinanceService {
    constructor(private _apiService: ApiService) { }

    public getAllFinance() {
        return this._apiService.get('finance');
    }

    public getOneFinance(Id) {
        return this._apiService.get(`finance/${Id}`);
    }

    public addFinance(body) {
        return this._apiService.post('finance', body);
    }

    public updateFinance(body) {
        return this._apiService.put('finance', body);
    }

    public deleteFinance(Id) {
        return this._apiService.delete(`finance/${Id}`);
    }

    public getAllExport() {
        return this._apiService.get('finance-export');
    }
}
