import { LoginService } from "./login.service";
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing"
import { TestBed, waitForAsync } from "@angular/core/testing"
import { User } from "./user.interface";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

const expectedUrl = 'http://localhost:3000/users';

describe('LoginService', () => {
    let loginService: LoginService;
    let controller: HttpTestingController;
    let router: Router;

    beforeEach(async () => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule],
            providers: [LoginService]
        });

        loginService = TestBed.inject(LoginService);
        controller = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
    });

    it('logs in the user if correct credentials are given',() => {
        const correctCredentials: User = { login: "admin", password: "admin" };
        let actualUser: User | null | undefined;
        const users = [
            {
                "login": "admin",
                "password": "admin"
            },
            {
                "login": "cook",
                "password": "cook"
            }
        ];

        loginService.loginUser(correctCredentials.login, correctCredentials.password).subscribe(user => {
            actualUser = user;
        });

        const request = controller.expectOne(expectedUrl);
        request.flush(users);
        controller.verify();

        expect(actualUser).toEqual(correctCredentials);
        expect(loginService.getLoggedInUser()).toEqual(correctCredentials);
        expect(JSON.parse(localStorage.getItem('user')!)).toEqual(correctCredentials);
    });

    it('returns null if wrong credentials', () => {
        const wrongCredentials: User = { login: "wrongJosh", password: "12345" };
        let actualUser: User | null | undefined;
        const users = [
            {
                "login": "admin",
                "password": "admin"
            },
            {
                "login": "cook",
                "password": "cook"
            }
        ];

        loginService.loginUser(wrongCredentials.login, wrongCredentials.password).subscribe(user => {
            actualUser = user;
        });

        const request = controller.expectOne(expectedUrl);
        request.flush(users);
        controller.verify();

        expect(actualUser).toBeNull();
        expect(loginService.getLoggedInUser()).toBeNull();
    });

    it('succesfully logs out after login', waitForAsync(() => {
        const wrongCredentials: User = { login: "admin", password: "admin" };
        let actualUser: User | null | undefined;
        
        const users = [
            {
                "login": "admin",
                "password": "admin"
            },
            {
                "login": "cook",
                "password": "cook"
            }
        ];

        loginService.loginUser(wrongCredentials.login, wrongCredentials.password).subscribe(user => {
            actualUser = user;
        });

        const request = controller.expectOne(expectedUrl);
        request.flush(users);
        controller.verify();

        spyOn(router, 'navigateByUrl');
        loginService.logoutUser();

        expect(loginService.getLoggedInUser()).toBeNull();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    }));

    it('guard method returns true if it is logged in, otherwise /login UrlTree', waitForAsync(() => {
        const wrongCredentials: User = { login: "admin", password: "admin" };
        let actualUser: User | null | undefined;
        
        const users = [
            {
                "login": "admin",
                "password": "admin"
            },
            {
                "login": "cook",
                "password": "cook"
            }
        ];

        expect(loginService.isLoggedIn()).toEqual(router.parseUrl("/login"));

        loginService.loginUser(wrongCredentials.login, wrongCredentials.password).subscribe(user => {
            actualUser = user;
        });

        const request = controller.expectOne(expectedUrl);
        request.flush(users);
        controller.verify();

        expect(loginService.isLoggedIn()).toBeTrue();
    }));
});