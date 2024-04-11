import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BrewingModule, routes } from './brewing.module';
import { LoginService } from '../login/login.service';
import { LoginModule } from '../login/login.module';

describe('BrewingModule Routing', () => {
    let router: Router;
    let loginServiceMock: jasmine.SpyObj<LoginService>;

    beforeEach(() => {
        loginServiceMock = jasmine.createSpyObj('LoginService', ['isLoggedIn']);
        TestBed.configureTestingModule({
            imports: [
                BrewingModule,
                RouterTestingModule.withRoutes(routes),
                LoginModule
            ],
            providers: [{ provide: LoginService, useValue: loginServiceMock }]
            
        });
        router = TestBed.inject(Router);
    });

    it('should navigate to inventory page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['inventory']);
        expect(router.url).toBe('/inventory');
    });

    it('should navigate to inventory/new page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['inventory/new']);
        expect(router.url).toBe('/inventory/new');
    });

    it('should navigate to the inventory item page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['inventory/:ingId']);
        expect(router.url).toBe('/inventory/:ingId');
    });

    it('should navigate to the recipe page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['recipes']);
        expect(router.url).toBe('/recipes');
    });

    it('should navigate to the recipe/new page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['recipes/new']);
        expect(router.url).toBe('/recipes/new');
    });

    it('should navigate to the recipe item page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['recipes/:recipeId']);
        expect(router.url).toBe('/recipes/:recipeId');
    });

    it('should navigate to the scheduled-brewing page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['scheduled-brewing']);
        expect(router.url).toBe('/scheduled-brewing');
    });

    it('should navigate to the scheduled-brewing/new page if user is logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(true);

        router.initialNavigation();
        await router.navigate(['scheduled-brewing/new']);
        expect(router.url).toBe('/scheduled-brewing/new');
    });

    it('should redirect to login if user is not logged in', async () => {
        loginServiceMock.isLoggedIn.and.returnValue(router.parseUrl('login'));

        router.initialNavigation();
        await router.navigate(['inventory']);
        expect(router.url).toBe('/login');

        await router.navigate(['inventory/new']);
        expect(router.url).toBe('/login');

        await router.navigate(['inventory/:ingId']);
        expect(router.url).toBe('/login');

        await router.navigate(['recipes']);
        expect(router.url).toBe('/login');

        await router.navigate(['recipes/new']);
        expect(router.url).toBe('/login');

        await router.navigate(['recipes/:recipeId']);
        expect(router.url).toBe('/login');

        await router.navigate(['scheduled-brewing']);
        expect(router.url).toBe('/login');

        await router.navigate(['scheduled-brewing/new']);
        expect(router.url).toBe('/login');
    });
});
