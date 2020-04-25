/**
 * Created by Sergey on 03.08.2017.
 */
import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class NotificationService {
  private notifyShowSubject = new Subject<any>();
  private notifyHideSubject = new Subject<any>();
  
  notifyObservableShow = this.notifyShowSubject.asObservable();
  notifyObservableHide = this.notifyHideSubject.asObservable();
  
  constructor(){}
  
  public notifyShow(type, message) {
    var data = {"t":type,"m":message};
    this.notifyShowSubject.next(data);
  }
  
  public notifyHide() {
    this.notifyHideSubject.next();
  }
}
