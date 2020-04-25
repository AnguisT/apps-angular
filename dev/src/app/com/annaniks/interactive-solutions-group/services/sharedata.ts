import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class MsgService {
  private messageSource = new BehaviorSubject(undefined);
  currentMessage = this.messageSource.asObservable();
  exportTable$ = new Subject();
  exportLiteTable$ = new Subject();
  exportAllTable$ = new Subject();
  showProjects$ = new BehaviorSubject(true);

  constructor() {}

  changeMessage(message: any) {
    this.messageSource.next(message);
  }
}
