import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {Subject} from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import {ProjectsService} from '../../../projects.service';
import {map, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {CETemplateDialogComponent} from 'src/app/com/annaniks/interactive-solutions-group/dialogs/ce_template/ce-template.dialog';
import {MsgService} from 'src/app/com/annaniks/interactive-solutions-group/services/sharedata';
import {ExportService} from 'src/app/com/annaniks/interactive-solutions-group/services/export.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
})
export class EstimateComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input('projectId') projectId: number;
  @Input('projectInfo') projectInfo;
  @Input('projectName') projectName;
  @Input('data') data;
  @Output('ondestroy') ondestroy: EventEmitter<any> = new EventEmitter();

  public estimateForm: FormGroup;
  public estimate;
  public projectWithCE = [];

  private $destroy: Subject<void> = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _projectsService: ProjectsService,
    private _matDialog: MatDialog,
    private msgService: MsgService,
    private _exportService: ExportService,
  ) {}

  ngOnInit() {
    this.initForm();
    this._getAllProjectWithCE().subscribe();
    if (!this.data) {
      this._getProjectCE(this.projectId).subscribe(() => {
        if (!Object.keys(this.estimate).length) {
          return;
        }
        this.estimateForm.patchValue({
          isCommission: this.estimate.isCommission,
          Commission: this.estimate.Commission,
        });
        this.setSection();
      });
    } else {
      this.estimate = this.data;
      this.estimateForm.patchValue({
        isCommission: this.estimate.isCommission,
        Commission: this.estimate.Commission,
      });
      this.setSection();
    }
  }

  ngAfterViewInit(): void {
    this._exportTable();
  }

  private _exportTable() {
    this.msgService.exportTable$
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        const body = {
          ...this.estimateForm.value,
          customerManager: this.projectInfo.mainCustomerManager,
          numberPersonProject: this.projectInfo.participantCount,
          executor: this.projectInfo.pm,
          projectName: this.projectName,
        };
        if (this.projectInfo.customer) {
          body.customer = this.projectInfo.customer.Denomination;
        }
        if (this.projectInfo.dateParty) {
          if (this.projectInfo.dateParty.Id === 1) {
            body.dateParty = formatDate(
              this.projectInfo.singleParty,
              'yyyy-MM-dd',
              'en',
            );
          } else if (this.projectInfo.dateParty.Id === 2) {
            this.projectInfo.multiDateParty.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          } else if (this.projectInfo.dateParty.Id === 3) {
            this.projectInfo.multiDatePartyPause.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          } else if (this.projectInfo.dateParty.Id === 4) {
            this.projectInfo.seriesDateParty.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          }
        }
        body.dateExport = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this._projectsService.exportEstimate(body).subscribe((res) => {
          const buffer = new Uint8Array(res['data']);
          const date = formatDate(new Date(), 'yyyyMMdd', 'en');
          this._exportService.saveExcelFile(
            buffer,
            `${date}_CE_IN_OUT_${this.projectName}`,
          );
        });
      });
    this.msgService.exportLiteTable$
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        const body = {
          ...this.estimateForm.value,
          customerManager: this.projectInfo.mainCustomerManager,
          numberPersonProject: this.projectInfo.participantCount,
          executor: this.projectInfo.pm,
          projectName: this.projectName,
        };
        if (this.projectInfo.customer) {
          body.customer = this.projectInfo.customer.Denomination;
        }
        if (this.projectInfo.dateParty) {
          if (this.projectInfo.dateParty.Id === 1) {
            body.dateParty = formatDate(
              this.projectInfo.singleParty,
              'yyyy-MM-dd',
              'en',
            );
          } else if (this.projectInfo.dateParty.Id === 2) {
            this.projectInfo.multiDateParty.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          } else if (this.projectInfo.dateParty.Id === 3) {
            this.projectInfo.multiDatePartyPause.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          } else if (this.projectInfo.dateParty.Id === 4) {
            this.projectInfo.seriesDateParty.forEach((date) => {
              body.dateParty = formatDate(date, 'yyyy-MM-dd', 'en');
            });
          }
        }
        body.dateExport = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this._projectsService.exportLiteEstimate(body).subscribe((res) => {
          const buffer = new Uint8Array(res['data']);
          const date = formatDate(new Date(), 'yyyyMMdd', 'en');
          this._exportService.saveExcelFile(
            buffer,
            `${date}_CE_IN_OUT_LITE_${this.projectName}`,
          );
        });
      });
  }

  public initForm() {
    this.estimateForm = this._fb.group({
      sections: new FormArray([this.createSection()]),
      totalPrice_IN: new FormControl(0),
      totalCost: new FormControl(0, Validators.required),
      totalCost_IN: new FormControl(0, Validators.required),
      totalProfit: new FormControl(0, Validators.required),
      totalPercent: new FormControl(100, Validators.required),
      isCommission: new FormControl(false),
      Commission: new FormControl(null),
    });
  }

  public setArticle(section) {
    const articles = [];
    section.articles.forEach((article) => {
      articles.push(
        new FormGroup({
          selected: new FormControl(false),
          NameArticle: new FormControl(
            article.NameArticle,
            Validators.required,
          ),
          Price: new FormControl(article.Price, Validators.required),
          NumberDays: new FormControl(article.NumberDays, Validators.required),
          NumberPerson: new FormControl(
            article.NumberPerson,
            Validators.required,
          ),
          Cost: new FormControl(article.Cost, Validators.required),
          Price_IN: new FormControl(article.Price_IN, Validators.required),
          Cost_IN: new FormControl(article.Cost_IN, Validators.required),
          Profit: new FormControl(article.Profit, Validators.required),
          Percent: new FormControl(article.Percent, Validators.required),
        }),
      );
    });
    return articles;
  }

  public setSection() {
    const sections = this.estimateForm.get('sections') as FormArray;
    const indArray = [];
    sections.controls.forEach((section, ind) => {
      indArray.push(ind);
    });
    indArray.reverse().forEach((item) => {
      sections.removeAt(item);
    });

    this.estimate.sections.forEach((section) => {
      sections.push(
        new FormGroup({
          selected: new FormControl(false),
          NameSection: new FormControl(
            section.NameSection,
            Validators.required,
          ),
          articles: new FormArray(this.setArticle(section)),
          TotalSectionPrice_IN: new FormControl(0),
          TotalSectionCost: new FormControl(
            section.TotalSectionCost,
            Validators.required,
          ),
          TotalSectionCost_IN: new FormControl(
            section.TotalSectionCost_IN,
            Validators.required,
          ),
          TotalSectionProfit: new FormControl(
            section.TotalSectionProfit,
            Validators.required,
          ),
          TotalSectionPercent: new FormControl(
            section.TotalSectionPercent,
            Validators.required,
          ),
        }),
      );
    });
  }

  public createSection() {
    return new FormGroup({
      selected: new FormControl(false),
      NameSection: new FormControl(null, Validators.required),
      articles: new FormArray([this.createArticle()]),
      TotalSectionCost: new FormControl(0, Validators.required),
      TotalSectionCost_IN: new FormControl(0, Validators.required),
      TotalSectionProfit: new FormControl(0, Validators.required),
      TotalSectionPercent: new FormControl(100, Validators.required),
    });
  }

  public createArticle() {
    return new FormGroup({
      selected: new FormControl(false),
      NameArticle: new FormControl(null, Validators.required),
      Price: new FormControl(0, Validators.required),
      NumberDays: new FormControl(0, Validators.required),
      NumberPerson: new FormControl(0, Validators.required),
      Cost: new FormControl(0, Validators.required),
      Price_IN: new FormControl(0, Validators.required),
      Cost_IN: new FormControl(0, Validators.required),
      Profit: new FormControl(0, Validators.required),
      Percent: new FormControl(100, Validators.required),
    });
  }

  public addSection() {
    const sections = this.estimateForm.get('sections') as FormArray;
    sections.push(this.createSection());
  }

  public deleteSection() {
    const sections = this.estimateForm.get('sections') as FormArray;
    const indArray = [];
    sections.controls.forEach((section, ind) => {
      if (section.get('selected').value) {
        indArray.push(ind);
      }
    });
    indArray.reverse().forEach((item) => {
      sections.removeAt(item);
    });
  }

  public addArticle(section) {
    const articles = section.controls.articles as FormArray;
    articles.push(this.createArticle());
  }

  public deleteArticle(section) {
    const articles = section.controls.articles as FormArray;
    const indArray = [];
    articles.controls.forEach((article, ind) => {
      if (article.get('selected').value) {
        indArray.push(ind);
      }
    });
    indArray.reverse().forEach((item) => {
      articles.removeAt(item);
    });
  }

  public calculate(article) {
    article
      .get('Cost')
      .setValue(
        +(
          article.get('Price').value *
          article.get('NumberDays').value *
          article.get('NumberPerson').value
        ).toFixed(2),
      );
    article
      .get('Cost_IN')
      .setValue(
        +(
          article.get('Price_IN').value *
          article.get('NumberDays').value *
          article.get('NumberPerson').value
        ).toFixed(2),
      );
    article
      .get('Profit')
      .setValue(
        +(article.get('Cost').value - article.get('Cost_IN').value).toFixed(2),
      );
    if (article.get('Cost').value !== 0) {
      article
        .get('Percent')
        .setValue(
          +(
            (article.get('Profit').value * 100) /
            article.get('Cost').value
          ).toFixed(2),
        );
    }
  }

  public getTotalSection(section, field, totalField) {
    const articles = section.controls.articles as FormArray;
    let total = 0;
    articles.controls.forEach((article) => {
      if (article.get(field)) {
        total += Number(article.get(field).value);
      }
    });
    if (section.get(totalField)) {
      section.get(totalField).setValue(total);
    }
    if (section.get('TotalSectionCost').value !== 0) {
      section
        .get('TotalSectionPercent')
        .setValue(
          +(
            (section.get('TotalSectionProfit').value * 100) /
            section.get('TotalSectionCost').value
          ).toFixed(2),
        );
    }
    return total;
  }

  public getTotal(field, totalField) {
    const sections = this.estimateForm.get('sections') as FormArray;
    let total = 0;
    sections.controls.forEach((article) => {
      if (article.get(field)) {
        total += Number(article.get(field).value);
      }
    });
    this.estimateForm.get(totalField).setValue(total);
    if (
      this.estimateForm.get('totalCost_IN').value !== 0 ||
      this.estimateForm.get('totalCost').value !== 0
    ) {
      this.estimateForm
        .get('totalPercent')
        .setValue(
          +(
            (this.estimateForm.get('totalProfit').value * 100) /
            this.estimateForm.get('totalCost').value
          ).toFixed(2),
        );
    } else {
      this.estimateForm.get('totalPercent').setValue(100);
    }
    return total;
  }

  public getCommission() {
    let res = 0;
    if (this.estimateForm.get('isCommission').value) {
      res =
        this.estimateForm.get('totalCost').value *
        (this.estimateForm.get('Commission').value / 100);
    }
    return res;
  }

  public openCETemplateDialog() {
    const dialogRef = this._matDialog.open(CETemplateDialogComponent, {
      width: '1500px',
      height: 'auto',
      minHeight: '500px',
      data: this.projectWithCE,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this._getProjectCE(data.Id).subscribe(() => {
          if (!Object.keys(this.estimate).length) {
            return;
          }
          this.setSection();
        });
      }
    });
  }

  private _getProjectCE(projectId) {
    return this._projectsService.getProjectCE(projectId).pipe(
      map((data) => {
        this.estimate = data['message'];
        return data;
      }),
    );
  }

  private _getAllProjectWithCE() {
    return this._projectsService.getAllProjectWithCE().pipe(
      map((data) => {
        this.projectWithCE = data['message'];
        return data;
      }),
    );
  }

  ngOnDestroy() {
    this.ondestroy.emit(this.estimateForm.value);
    this.$destroy.next();
    this.$destroy.complete();
  }
}
