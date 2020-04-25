import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, EventEmitter, ViewChild,
} from '@angular/core';
import {TableSearchService} from '../../services/viewsearch/table.search.service';
import {SessionStorageService, LocalStorageService} from 'ng2-webstorage';

// Form
import {SearchFormConfig} from '../../modules/search/form/search.form.config';
import {SearchFormProvider} from '../../modules/search/form/providers/search.form.provider';
import {AppSettingsInterface} from "../../modules/common/app.settings/app.settings.interface";
import {DetailData} from "../../services/viewsearch/detail.service";
import {SettingsGroupsService} from "../../services/system.config/settings.groups.service";
import {SimplifiedSettings} from "../../modules/settings/simplified/types";
import {OverlayComponent} from "../../modules/overlay/overlay";
import {SimplifiedSettingsProvider} from "../../modules/settings/simplified/provider";
import {SearchTypes} from "../../services/system.config/search.types";
import {ActivatedRoute, Router} from "@angular/router";
import {DefaultSearchProvider} from "../../modules/search/providers/defaultSearchProvider";
import {StartSearchFormComponent} from "./components/search/start.search.form.component";


@Component({
  selector: 'start-search',
  templateUrl: './tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  // changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [
    TableSearchService,
    DetailData,
    SearchFormProvider,
    SimplifiedSettingsProvider,
    SettingsGroupsService
  ],
  entryComponents: [
    OverlayComponent,
    StartSearchFormComponent
  ]
})

export class StartSearchComponent {

  staticSearchType: string;
  private sub: any;


  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.staticSearchType = params['staticSearchType'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}



