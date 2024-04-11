import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoginService } from './login/login.service';
import { User } from './login/user.interface';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

let isLoggedIn = false;

function createLoginServiceMock() {
    let user: User = { login: 'admin', password: 'admin' };
    let fakeLoginService: Pick<LoginService, keyof LoginService>;
    fakeLoginService = {
        getLoggedInUser(): User | null {
            return isLoggedIn ? user : null;
        },
        loginUser(username: string, password: string) {
            return of(null);
        },
        isLoggedIn() {
            return isLoggedIn;
        },
        logoutUser() { }
    }
    return fakeLoginService;
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let fakeLoginService: Pick<LoginService, keyof LoginService>;

    beforeEach(async () => {
        localStorage.clear();
        fakeLoginService = createLoginServiceMock();

        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: LoginService, useValue: fakeLoginService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should display guest if user in not logged in', () => {
        fakeLoginService.logoutUser();
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('span');
        expect(element.textContent).toContain('Guest');
    });

    it('should show user name when user is logged in', () => {
        isLoggedIn = true;
        fixture.detectChanges();

        const element = fixture.nativeElement.querySelector('span');
        expect(element.textContent).toContain('admin');
    });

    it('should call logout method on click', () => {
        isLoggedIn = true;
        fixture.detectChanges();
        spyOn(fakeLoginService, 'logoutUser');
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(fakeLoginService.logoutUser).toHaveBeenCalled();
    });

    afterEach(() => {
        isLoggedIn = false;
    });
});
