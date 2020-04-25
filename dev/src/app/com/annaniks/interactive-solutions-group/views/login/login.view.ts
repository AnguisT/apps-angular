import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: 'login.view.html',
    styleUrls: ['login.view.css']
})
export class LoginView implements OnInit, OnDestroy {
    public loginForm: FormGroup;
    private _subscription: Subscription;
    public error: string = '';
    constructor(private _router: Router, private _loginService: LoginService) { }

    ngOnInit() {
       this._formBuilder();
    }

    private _formBuilder() {
        this.loginForm = new FormBuilder().group({
           email: ['', [Validators.required]],
           password: ['', Validators.required]
        })
    }

    public logIn() {
        if (this.loginForm.valid) {
            this._subscription = this._loginService.logIn(
                this.loginForm.get('email').value,
                this.loginForm.get('password').value).subscribe(
                    () => {
                        this._router.navigate(['/projects/all-projects'])
                    },
                    (error) => {
                        this.error = 'Пользователь не найден'
                    })
        }
    }

public close() {
    this.error = ''
}
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}