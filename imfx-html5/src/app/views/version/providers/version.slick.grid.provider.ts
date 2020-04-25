import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {ApplicationRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {Router} from "@angular/router";
import {BasketService} from "../../../services/basket/basket.service";
import {SlickGridRowData} from "../../../modules/search/slick-grid/types";
import {IMFXModalComponent} from "../../../modules/imfx-modal/imfx-modal";
import {UploadComponent} from "../../../modules/upload/upload";
import {IMFXModalProvider} from "../../../modules/imfx-modal/proivders/provider";
import {RaiseWorkflowWizzardComponent} from "../../../modules/rw.wizard/rw.wizard";
import {VersionWizardComponent} from "../../../modules/version-wizard/wizard";
import {VersionWizardProvider} from "../../../modules/version-wizard/providers/wizard.provider";


export class VersionSlickGridProvider extends SlickGridProvider {
    public router: Router;
    private basketService: BasketService;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.basketService = injector.get(BasketService);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
    }

    upload($event) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent = modalProvider.show(UploadComponent, {
            title: 'base.media_upload',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });
        let data = this.getSelectedRow();
        modal.contentView.instance.setVersion((<any>data).ID, (<any>data).FULLTITLE);
    }

    showRaiseWorkflowWizzard($events) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent = modalProvider.show(RaiseWorkflowWizzardComponent, {
            title: 'rwwizard.title',
            size: 'md',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });

        (<RaiseWorkflowWizzardComponent>modal.contentView.instance).rwwizardprovider.open(this.getSelectedRow(), "Version");
    }

    clipEditor($events) {
        let modalProvider = this.injector.get(IMFXModalProvider);
        let modal: IMFXModalComponent = modalProvider.show(VersionWizardComponent, {
            title: 'version.wizard.title',
            size: 'xl',
            position: 'center',
            footerRef: 'modalFooterTemplate'
        });

        let wizardView: VersionWizardComponent = (<VersionWizardComponent>modal.contentView.instance);
        let wizardProvider: VersionWizardProvider = wizardView.provider;
        let data = this.getSelectedRow();
        wizardProvider.showModal(data.ID);
    }

    addToBasket($events) {
        let data = this.getSelectedRowData();
        if (!this.isOrdered(data)) {
            this.basketService.addToBasket(data, "Version");
        }

        // for update state for other formatters at row
        let slick = this.getSlick();
        slick.invalidateRow(this.getSelectedRowId());
        slick.render();
    }

    isOrdered(data?: SlickGridRowData): boolean {
        if (!data) {
            data = this.getSelectedRowData();
        }

        return data ? this.basketService.hasItem(data) : false;
    }
}
