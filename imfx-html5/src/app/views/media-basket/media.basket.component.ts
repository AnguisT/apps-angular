import {ChangeDetectorRef, Component, Inject, ViewChild, ViewEncapsulation} from "@angular/core";
import {Location} from "@angular/common";
import {BasketService} from "../../services/basket/basket.service";
import {XMLService} from "../../services/xml/xml.service";
import {NotificationService} from "../../modules/notification/services/notification.service";
import {TranslateService} from "ng2-translate";


@Component({
    moduleId: 'media-basket',
    selector: 'media-basket',
    templateUrl: './tpl/index.html',
    styleUrls: [
        'styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class MediaBasketComponent {
    @ViewChild('mediaBasketPreset') private dropdownModule;
    @ViewChild('xmlTree') private xmlTree;
    private items: any = [];
    private presets: any = [];
    private selectedPreset: any;
    private message: String;
    private orderStatus: OrderStatus;
    private selectedSchemaModel: any = {};
    private selectedXmlModel: any = {};
    private showNotification = false;
    private loading = false;

    constructor(private basketService: BasketService,
                private cdr: ChangeDetectorRef,
                private xmlService: XMLService,
                private translate: TranslateService,
                @Inject(NotificationService) protected notificationRef: NotificationService,
                private location: Location) {
    }

    ngOnInit() {
        this.basketService.items
            .subscribe(updatedItems => this.items = updatedItems);
        this.basketService.getOrderPresets()
            .subscribe(result => {
                this.presets = result;
                this.selectPreset();
                debugger;
                this.cdr.detectChanges();
            });
        this.orderStatus = OrderStatus.Ready;
    }

    onPresetChange() {
        if (this.selectedPreset.SchemaId != 0) {
            this.xmlService.getXmlData(this.selectedPreset.SchemaId).subscribe(
                (result: any) => {
                    if (result) {
                        this.selectedSchemaModel = result.SchemaModel;
                        this.selectedXmlModel = result.XmlModel;
                        this.cdr.detectChanges();
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    isPlaceOrderEnabled() {
        return this.items && this.items.length > 0 && this.selectedPreset;
        // return this.items.filter(item => item.selected).length;
    }

    placeOrder() {
        this.loading = true;
        if (!this.isPlaceOrderEnabled()) {
            return;
        }
        var that = this;
        this.basketService.placeOrder({
            preset: this.selectedPreset,
            note: this.message,
            schemaId: this.selectedPreset && this.selectedPreset.SchemaId,
            xmlDocAndSchema: this.selectedPreset && this.selectedPreset.SchemaId ? this.xmlTree.getXmlModel() : undefined
        }).subscribe((result) => {
            let message = this.translate.instant("basket.success_message");
            message += '\n\rJobId: ' + result.JobId;
            this.notificationRef.notifyShow(1, message);
            that.loading = false;
            this.cdr.detectChanges();
        }, (error) => {
            let message = this.translate.instant("basket.error_message");
            if (typeof error._body == 'string') {
                message = error._body.replace(/.*\(.*\): /, "");
            } else {
                let errorLines = error.json().Message.match(/[^\r\n]+/g);
                message = errorLines[0].replace(/.*\(.*\): /, "");
            }
            this.notificationRef.notifyShow(2, message);
            this.cdr.detectChanges();
            that.loading = false;
        })
    }

    selectPreset() {
        let data = this.dropdownModule.turnArrayOfObjectToStandart(this.presets, {
            key: 'Id',
            text: 'Name'
        });
        this.dropdownModule.setData(data, true);
    }

    onSelect($event) {
        let obj = this.presets.filter(pr => pr.Id == $event.params.data.id);
        this.selectedPreset = $event.params.data;
        this.selectedPreset.SchemaId = obj[0].SchemaId;
        this.selectedPreset.Id = this.selectedPreset.id;
        this.onPresetChange();
    }

    clickBack() {
        this.location.back();
    }

    clearAll() {
        if (this.items && this.items.length > 0) {
            this.basketService.removeFromBasket(this.items);
        }
    }

    checkSelected() {
        return this.items.filter((el) => el.selected == true).length > 0;
    }

    clearSelected() {
        if (this.items && this.items.length > 0) {
            let items = this.items;
            items = items.filter((el) => el.selected == true);
            this.basketService.removeFromBasket(items);
        }
    }


    private getErrorTextForPresets(error) {
        let msg: string;
        try {
            let errObj = error.json();
            msg = errObj.Message.match(/[^\r\n\[*.\]]+/g)[2].replace(/.*\(.*\): /, "").trim();
        } catch (e) {
            msg = this.translate.instant("basket.error_message");
        }

        return msg;
    }
}

enum OrderStatus {
    Ready = 1,
    Loading = 2,
    Success = 3,
    Error = 4
}
