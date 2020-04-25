/**
 * Created by Sergey on 03.08.2017.
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NotificationService } from './services/notification.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'notification',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
    private show = false;
    private message = '';
    private notificationType = 1;
    private showNotificationSubscription: Subscription;
    private hideNotificationSubscription: Subscription;
    @ViewChild('messageEl') private messageEl: any;
    @ViewChild('notificationWrapperEl') private wrapEl;
    private tickHandler;
    private tickPaused: boolean = false;
    private copied: boolean = false;

    constructor(private cdr: ChangeDetectorRef,
        @Inject(NotificationService) protected  notificationService: NotificationService) {

    }

    ngOnInit() {
        let self = this;
        this.showNotificationSubscription = this.notificationService.notifyObservableShow
        .subscribe((res) => {
            self.ShowNotificationHandler(res.t, res.m);
            self.cdr.detectChanges();
        });
        this.hideNotificationSubscription = this.notificationService.notifyObservableHide
        .subscribe(() => {
            self.HideNotificationHandler();
            self.cdr.detectChanges();
        });
    }

    ngAfterViewInit() {
        $(this.wrapEl.nativeElement).hover(() => {
            this.tickPaused = true;
        }, () => {
            this.tickPaused = false;
        });
    }

    ngOnDestroy() {
        this.showNotificationSubscription.unsubscribe();
        this.hideNotificationSubscription.unsubscribe();
    }

    ShowNotificationHandler(type, msg) {
        this.message = msg;
        this.notificationType = type;
        this.show = true;
        this.cdr.detectChanges();
        let self = this;
        let tick = 0;
        let tickLimit = 3;
        if (type === 1) { // auto-close for success status only
            this.tickHandler = setInterval(() => {
                if (!self.tickPaused) {
                    tick++;
                }
                if (tick >= tickLimit) {
                    tick = 0;
                    clearInterval(self.tickHandler);
                    self.HideNotificationHandler();
                }
            }, 1000);
        }
    }

    HideNotificationHandler() {
        this.show = false;
        this.notificationType = 3;
        this.cdr.detectChanges();
    }

    CopyToClipboard() {
        let self = this;
        if (this.notificationType === 2) {
            let $temp = $('<input>');
            $('body').append($temp);
            $temp.val($(this.messageEl.nativeElement).text()).select();
            document.execCommand('copy');
            $temp.remove();
            this.copied = true;
            setTimeout(() => {
                self.copied = false;
                self.show = false;
                self.cdr.detectChanges();
            }, 3000);
            this.cdr.detectChanges();
        }
    }
}

enum NotificationType {
    Success = 1,
    Error = 2,
    Ready = 3
}
