/**
 * Created by Sergey Trizna on 13.01.2018.
 */
import {ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Inject, Injector} from "@angular/core";
import {BasketService} from "../../../services/basket/basket.service";
import {Router} from "@angular/router";
import {SlickGridProvider} from "../../../modules/search/slick-grid/providers/slick.grid.provider";
import {SlickGridEventData} from "../../../modules/search/slick-grid/types";
import {appRouter} from "../../../constants/appRouter";
import {SilverlightProvider} from "../../../providers/common/silverlight.provider";
import {TasksMyComponent} from "../tasks.my.component";


export class TasksMySlickGridProvider extends SlickGridProvider {
    public router?: Router;
    private basketService?: BasketService;
    public compFactoryResolver?: ComponentFactoryResolver;
    public appRef?: ApplicationRef;
    public selectedSubRow?: { id?: number, index?: number } = {};
    public expandedRows?: number[] = [];
    public cdr: ChangeDetectorRef;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
        this.router = injector.get(Router);
        this.basketService = injector.get(BasketService);
        this.compFactoryResolver = injector.get(ComponentFactoryResolver);
        this.appRef = injector.get(ApplicationRef);
        this.cdr = injector.get(ChangeDetectorRef);
    }

    onRowDoubleClicked(data: SlickGridEventData) {
        let silver = this.injector.get(SilverlightProvider);
        debugger

        let item: any = data.row;
        if (item.TSK_TYPE === 62 && silver.isSilverlightInstalled) {
            this.router.navigate(
                [
                    appRouter.media_logger.job.substr(
                        0,
                        appRouter.media_logger.job.lastIndexOf('/')
                    ),
                    item.ID
                ]
            );
            return true;
        }
        else if (item.TSK_TYPE === 1) {
            switch (item.TECH_REPORT_SUBTYPE) {
                case "subtitleassess":
                    this.router.navigate(
                        [
                            appRouter.workflow.subtitle_qc.substr(
                                0,
                                appRouter.workflow.subtitle_qc.lastIndexOf('/')
                            ),
                            item.ID
                        ]
                    );
                    break;
                case "simpleassess":
                    this.router.navigate(
                        [
                            appRouter.workflow.assessment.substr(
                                0,
                                appRouter.workflow.assessment.lastIndexOf('/')
                            ),
                            item.ID
                        ]
                    );
                    break;
                default:
                    break;
            }
        }
    }

    selectedRows;

    refreshGrid() {
        if (this.lastSearchModel) {
            this.selectedRows = this.getSlick().getSelectedRows();
            this.buildPage(this.lastSearchModel, false, false);
            this.getSlick().render();
            (<TasksMyComponent>this.componentContext).refreshStarted = true;
        }
    }

    afterRequestData(resp, searchModel) {
        super.afterRequestData(resp, searchModel);
        if ((<TasksMyComponent>this.componentContext).refreshStarted) {
            this.getSlick().setSelectedRows(this.selectedRows);
        }
        (<TasksMyComponent>this.componentContext).refreshStarted = false;
    }
}
