import { Component } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '../../../../../../../../../node_modules/@angular/material';
import { AddContactDialog, ErrorDialog, AddContractsDialog, ConfirmDialog } from '../../../../dialogs';
import { ContactsService } from '../contacts.service';
@Component({
    selector: 'edit-subcontractor-view',
    templateUrl: 'edit-subcontractor.view.html',
    styleUrls: ['edit-subcontractor.view.scss']
})
export class EditSubcontractorView {
    private _subscription: Subscription;
    public allSphereActivity;
    public selectedSphereActivity;
    public subcontractorName;
    public subcontractor;
    public id: number;
    public loading: boolean;
    public contacts = [];
    public contracts;
    public subcontractorSurname;
    public isNew: boolean;
    public contactPostArray = [];
    public contractUrl;
    public comment: string;
    public isError: boolean = false;
    public errorMessage: string;
    constructor(private _contactsService: ContactsService, private _dialog: MatDialog, private _router: Router, private _activatedRoute: ActivatedRoute) {
        this._activatedRoute.params.subscribe(params => {
            this.id = params['id'];
        })
        this.loading = this.id ? true : false;
    }
    ngOnInit() {
        this._combineObservables();
    }
    private _combineObservables() {
        const combined = forkJoin(
            this._getAllSphereActivity()
        )
        this._subscription = combined.subscribe(data => {
            this._getSubcontractorById()
        })
    }
    /**
     * return object with key message
     */
    private _getSubcontractorById() {
        if (this.id) {
            this._contactsService.getSubcontractorById(this.id).subscribe((data) => {
                this.subcontractor = data['data']['message'][0];
                // console.log(data);
                this.contacts = data['data']['Contact']
                this.subcontractorName = this.subcontractor.Name;
                this.selectedSphereActivity = this._getSelectedElement();
                this.contracts = (this.subcontractor.Contracts) ? this.subcontractor.Contracts.split(',') : [];
                this.contracts.forEach((element: string, index: number) => {
                    if (element.length == 0) {
                        this.contracts.splice(index, 1);
                    }
                });
                this.subcontractorSurname = this.subcontractor.Surname;
                this.comment = this.subcontractor.Comments
                this.loading = false;
            })
        }
    }
    /**
     * add contact
     */
    public addContact() {
        this.isNew = this.id ? true : false;
        let dialogRef = this._dialog.open(AddContactDialog, {
            height: '400px',
            width: '400px',
            data: { new: this.isNew, id: this.id, url: 'subcontractor' }
        })
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.id) {
                    this.loading = true;
                    this._getSubcontractorById()
                } else {
                    this.contacts.push({ ContactType: result.selectedInfo.Name, ContactTypeId: result.selectedInfo.Id, ContactValue: result.text })
                }
            }
        })
    }
    /**
     * return object
     * for get selected sphere activity
     */
    private _getSelectedElement() {
        return this.allSphereActivity.filter(data => {
            return data['Id'] == this.subcontractor.SphereActivityId
        })[0]
    }
    /**
     * return object with key message
     */
    private _getAllSphereActivity() {
        return this._contactsService.getAllSphereActivity().pipe(
            map((data) => {
                this.allSphereActivity = data['message'];
                return data
            })
        )
    }
    /**
     * return object
     * delete subcontractor
     */
    public deleteSubcontractor() {
        if (this.id) {
            let dialogRef = this._dialog.open(ConfirmDialog, {
                width: '350px',
                panelClass: 'padding24'
            })
            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this._contactsService.deleteSubcontractor(this.id).subscribe(data => {
                        // console.log(data);
                        this._router.navigate(['/contacts/subcontractor'])
                    }, (error) => {
                        let dialogRef = this._dialog.open(ErrorDialog, {
                            width: "375px",
                            height: " 120px",
                            data: { message: error['error']['message'] }
                        })
                    })
                }
            })
        }
    }
    /**
     * return object
     */
    public addOrChangeSubcontractor() {
        if (this.id) {
            let contract = this.contracts.join();
            this.loading = true
            this._contactsService.changeSubcontractorOrManager('subcontractor', this.id, this.subcontractorName, this.subcontractorSurname, "lastname", contract, this.selectedSphereActivity.Id, this.comment).subscribe(data => {
                // console.log(data);
                this.loading = false;
                this._router.navigate(['/contacts/subcontractor'])
            },
                (error) => {
                    this.loading = false;
                    this.isError = true;
                    // console.log(error['error']['message']);
                    this.errorMessage = error['error']['message']
                })
        } else {
            this.loading = true
            for (let i of this.contacts) {
                this.contactPostArray.push({
                    "ContactTypeId": i["ContactTypeId"],
                    "Text": i["ContactValue"]
                })
            }

            this._contactsService.addSubcontractor(this.subcontractorName, this.subcontractorSurname, this.contractUrl, this._checkSelect(this.selectedSphereActivity, "Id"), this.contactPostArray, "last", this.comment).subscribe(data => {
                // console.log(data);
                this.loading = false;
                this._router.navigate(['/contacts/subcontractor'])
            },
                (error) => {
                    this.loading = false;
                    this.isError = true;
                    // console.log(error['error']['message']);
                    this.errorMessage = error['error']['message']
                })
        }
    }
    /**
     * 
     * @param object 
     * @param key 
     */
    private _checkSelect(object, key) {
        let checkedSelect: number = 0;
        if (object && object[key]) {
            checkedSelect = object[key];
        }
        return checkedSelect
    }
    /**
     * add  contract 
     * return object
     */
    public addContract() {
        let dialogRef = this._dialog.open(AddContractsDialog, {
            height: '300px',
            width: '400px',
            data: { id: this.id, key: 'subcontractor' }
        })
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                // console.log(result);
                this._getSubcontractorById()
            }
        })
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}