import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class ProgrammsService {
    constructor(private _apiService: ApiService) { }

    public addNewProgramm(body) {
        return this._apiService.post('programm', body);
    }

    public updateProgramm(body) {
        return this._apiService.put('programm', body);
    }

    public getAllProgramm() {
        return this._apiService.get('programm');
    }

    public deleteProgramm(Id) {
        return this._apiService.delete(`programm/${Id}`);
    }

    public getOneProgrammById(Id) {
        return this._apiService.get(`programm/${Id}`);
    }

    public getProgrammCE(Id) {
        return this._apiService.get(`programm-ce/${Id}`);
    }

    public addProgrammCE(body) {
        return this._apiService.post('programm-ce', body);
    }

    public deleteProgrammCE(Id) {
        return this._apiService.delete(`programm-ce/${Id}`);
    }

    public getOneSAByCEId(Id) {
        return this._apiService.get(`programm-sa/${Id}`);
    }

    public updateProgrammSA(body) {
        return this._apiService.put('programm-sa', body);
    }

    public addTemplateCE(body) {
        return this._apiService.put('programm-template', body);
    }

    public getAllFormats() {
        return this._apiService.get('formatProject');
    }

    public exportEstimate(body) {
        return this._apiService.post('programm-export', body);
    }

    public exportAllProgramm() {
        return this._apiService.get('programm-all-export');
    }
}
