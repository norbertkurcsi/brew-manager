import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { User } from "./user.interface";

@Component({
    selector: 'login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    emptyLogin = false;
    emptyPass = false;
    wrongCredentials = false;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    private handleLoginResponse(user: User | null) {
        if (user) {
            this.router.navigateByUrl('/inventory');
        } else {
            this.wrongCredentials = true;
            this.form.setValue({ login: '', password: '' });
        }
    }

    private setEmptyLoginFlag() : boolean {
        return this.form.value.login === "";
    }

    private setEmptyPassFlag() : boolean {
        return this.form.value.password === "";
    }

    private resetFlags() {
        this.emptyLogin = false;
        this.emptyPass = false;
        this.wrongCredentials = false;
    }

    private setFlags() {
        this.emptyLogin = this.setEmptyLoginFlag();
        this.emptyPass = this.setEmptyPassFlag();
    }

    public loginUser() {
        this.resetFlags();
        this.setFlags();
        if (this.form.valid) {;
            let login: string = this.form.value.login || "";
            let password: string = this.form.value.password || "";

            this.loginService.loginUser(login, password).subscribe(user => {
                this.handleLoginResponse(user);
            });
        }
    }
}
