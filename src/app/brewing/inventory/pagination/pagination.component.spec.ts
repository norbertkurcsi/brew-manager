import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
        declarations: [PaginationComponent],
        providers: [
            { provide: ActivatedRoute, useValue: activatedRouteSpy },
            { provide: Router, useValue: routerSpy },
        ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('stepOnNextPage', () => {
        it('should navigate to the next page', () => {
            activatedRouteSpy.snapshot.queryParams = {};
            component.stepOnNextPage();
            expect(routerSpy.navigate).toHaveBeenCalledWith([], {
                relativeTo: activatedRouteSpy,
                queryParams: { page: 2 },
            });
        });
    });

    describe('stepOnPrevPage', () => {
        it('should navigate to the previous page when current page is greater than 1', () => {
            activatedRouteSpy.snapshot.queryParams = { page: 2 };
            component.stepOnPrevPage();
            expect(routerSpy.navigate).toHaveBeenCalledWith([], {
                relativeTo: activatedRouteSpy,
                queryParams: { page: 1 },
            });
        });

        it('should not navigate when current page is 1', () => {
            activatedRouteSpy.snapshot.queryParams = { page: 1 };
            component.stepOnPrevPage();
            expect(routerSpy.navigate).toHaveBeenCalledWith([], {
                relativeTo: activatedRouteSpy,
                queryParams: { page: 1 },
            });
        });
    });
});