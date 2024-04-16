import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { LoginService } from "./login.service";
import { of } from "rxjs";
import { User } from "./user.interface";
import { Router, RouterModule } from "@angular/router";
import { routes } from "./login.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

let successfulLogin = true;

function createLoginServiceMock() {
    let user: User = { login: 'admin', password: 'admin' };
    let fakeLoginService: Pick<LoginService, keyof LoginService>;
    fakeLoginService = {
        getLoggedInUser(): User | null {
            return successfulLogin ? user : null;
        },
        loginUser(username: string, password: string) {
            return of(successfulLogin ? user : null);
        },
        isLoggedIn() {
            return successfulLogin;
        },
        logoutUser() { }
    }
    return fakeLoginService;
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let fakeLoginService: Pick<LoginService, keyof LoginService>;
    let fakeRouter : Router;

    beforeEach(async () => {
        localStorage.clear();
        fakeLoginService = createLoginServiceMock();
        fakeRouter = jasmine.createSpyObj(['navigateByUrl']);

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: LoginService, useValue: fakeLoginService },
                { provide: Router, useValue: fakeRouter}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display required username, if username is empty, and the submit is pressed', () => {
        const button = fixture.nativeElement.querySelector('button');
        const usernameInput = fixture.nativeElement.querySelector('#username');
        
        button.click();
        fixture.detectChanges();
        let usernameError = fixture.nativeElement.querySelector('#username-error');
        expect(usernameError.textContent).toContain('*required username');

        usernameInput.value = 'testuser';
        usernameInput.dispatchEvent(new Event('input'));
        button.click();
        fixture.detectChanges();
        usernameError = fixture.nativeElement.querySelector('#username-error');
        expect(usernameError).toBeFalsy();
    });


    it('should display required password, if password is empty, and the submit is pressed', () => {
        const button = fixture.nativeElement.querySelector('button');
        const passwordInput = fixture.nativeElement.querySelector('#password');
        
        button.click();
        fixture.detectChanges();
        let passwordError = fixture.nativeElement.querySelector('#password-error');
        expect(passwordError.textContent).toContain('*required password');

        passwordInput.value = '12345';
        passwordInput.dispatchEvent(new Event('input'));
        button.click();
        fixture.detectChanges();
        passwordError = fixture.nativeElement.querySelector('#password-error');
        expect(passwordError).toBeFalsy();
    });

    it('if credentials are correct, should call the router\'s navigate function to /inventory', () => {
        successfulLogin = true;
        component.form.setValue({ login: 'admin', password: 'admin' });
        component.loginUser();
        expect(fakeRouter.navigateByUrl).toHaveBeenCalledWith('/inventory');
    });

    it('if credentials are incorrect, should delete the form values and display that the user or pass are incorrect', () => {
        successfulLogin = false;
        component.form.setValue({ login: 'admin', password: 'wrongpass' });
        component.loginUser();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.hiba').textContent).toContain('*wrong user or password');
        expect(component.form.value.login).toBe('');
        expect(component.form.value.password).toBe('');
    });
});
