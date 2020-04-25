import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Injector, OnInit,
  ViewEncapsulation
} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {Router} from "@angular/router";
import {EditArticleModalProvider} from "./edit.article.modal.provider";


@Component({
  selector: 'save-layout-modal',
  templateUrl: 'tpl/index.html',
  styleUrls: [
    './styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EditArticleModalProvider
  ]
})

export class EditArticleModalComponent implements OnInit, AfterViewInit {

  private data: any;
  private showOverlay: boolean = false;
  private saveEmitter: EventEmitter<any>;

  constructor(private cdr: ChangeDetectorRef,
              private injector: Injector,
              private translate: TranslateService,
              private editArticleModalProvider: EditArticleModalProvider,
              private router: Router) {
    this.router.events.subscribe(() => {
      this.closeModal();
    });

    this.editArticleModalProvider.moduleContext = this;

    // modal data
    this.data = this.injector.get('modalRef');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  setData(saveEmitter: EventEmitter<any>) {
    this.toggleOverlay(false);
    this.saveEmitter = saveEmitter;
  }

  saveLayout() {
    this.toggleOverlay(true);
    this.saveEmitter.emit();
    this.closeModal();
  }

  closeModal() {
    this.data.hide();
    this.showOverlay = false;
  }

  toggleOverlay(show) {
    this.showOverlay = show;
    this.cdr.detectChanges();
  }
}
