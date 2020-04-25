import {
    Component, EventEmitter, Injector, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {IMFXModalComponent} from "../../../../modules/imfx-modal/imfx-modal";
import {LookupService} from "../../../../services/lookup/lookup.service";
import {NamesService} from "../../services/names.service";

@Component({
    selector: 'names-modal',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/index.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NamesService
    ]
})

export class NamesModalComponent  {

    @ViewChild('modalFooterTemplate', {read: TemplateRef}) modalFooterTemplate: TemplateRef<any>;
    @ViewChild('countrySelect') private countrySelect;
    @ViewChild('countryDeliverySelect') private countryDeliverySelect;

    private modalRef: IMFXModalComponent;
    private nameData;
    private contextData;
    private sendData = {
        "NameObject": {
            "ID": 0,
            "NAME_OWNER_ID": 0,
            "CONCAT_SEARCH_NAME": "",
            "CNTCT_FSTNAME": "",
            "CNTCT_OTHNMS": "",
            "CNTCT_SURNAME_OR_CMPNY_NAME": "",
            "CNTCT_SUFFIX": ""
        },
        "EntityObject": {
            "ID": 0,
            "EMAIL1": "",
            "EMAIL2": "",
            "EMAIL3": "",
            "EMAIL4": "",
            "WEB1": "",
            "PHONE1": "",
            "PHONE2": "",
            "FAX": "",
            "MOBILE": "",
            "ADDR": "",
            "CITY": "",
            "STATE": "",
            "COUNTRY_ID": 0,
            "POSTCODE": "",
            "DELIVERY_ADDRESS": "",
            "DELIVERY_CITY": "",
            "DELIVERY_STATE": "",
            "DELIVERY_COUNTRY": 0,
            "DELIVERY_POSTCODE": ""
        }
    };
    private countries = [];
    private countriesSelect2 = [];

    constructor(protected injector: Injector,
                protected service: NamesService,
                protected lokupService: LookupService) {
        this.modalRef = this.injector.get('modalRef');
        let d = this.modalRef.getData();
        this.nameData = d.namesContext;
        this.contextData = d.nameData;
        if(this.contextData) {
            this.sendData = JSON.parse(JSON.stringify( this.contextData ));
        }
        this.lokupService.getLookups('Countries').subscribe((res) => {
            if(res && res.length > 0) {
                this.countries = res;
                this.countriesSelect2 = res.map((val) => {
                    return { id: val.Id, text: val.Value};
                });
            }
        });
    }

    ngAfterViewInit() {
        this.selectCountry();
    }

    closeModal() {
        this.modalRef.hide();
    }

    selectCountry() {
        this.countrySelect.setData(this.countriesSelect2, true);
        this.countryDeliverySelect.setData(this.countriesSelect2, true);
        this.setSelectedCountry();
    }

    setSelectedCountry() {
        if(this.contextData && this.contextData.EntityObject.COUNTRY_ID) {
            let index = this.countrySelect.indexOf(this.countriesSelect2);
            this.countrySelect.setSelectedByIds([index]);
        }
        if(this.contextData && this.contextData.EntityObject.DELIVERY_COUNTRY) {
            let index = this.countryDeliverySelect.indexOf(this.countriesSelect2);
            this.countryDeliverySelect.setSelectedByIds([index]);
        }
    }

    saveData() {
        if(!this.contextData) {
            this.service.addName(this.sendData).subscribe((res) => {
                this.modalRef.emitClickFooterBtn('ok');
                this.closeModal();
            });
        }
        else {
            this.service.editName(this.sendData, this.contextData.NameObject.ID).subscribe((res) => {
                this.modalRef.emitClickFooterBtn('ok');
                this.closeModal();
            });
        }
    }

    onSelectCountry($event) {
        this.sendData.EntityObject.COUNTRY_ID = $event.params.data.id;
    }

    onSelectDeliveryCountry($event) {
        this.sendData.EntityObject.DELIVERY_COUNTRY = $event.params.data.id;
    }
}
