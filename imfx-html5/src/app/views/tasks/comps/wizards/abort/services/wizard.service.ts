import {Inject, Injectable} from "@angular/core";
import {CoreService} from "../../../../../../core/core.service";
import {HttpService} from "../../../../../../services/http/http.service";
@Injectable()
export class TasksWizardAbortComponentService extends CoreService {
    httpService: HttpService;

    constructor(@Inject(HttpService) _httpService: HttpService) {
        super(_httpService)
    }

}