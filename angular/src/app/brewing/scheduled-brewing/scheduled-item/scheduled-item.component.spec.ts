import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScheduledBrew } from '../interfaces/schedules-brews.interface';
import { ScheduledBrewService } from '../services/scheduled-brew.service';
import { ScheduledItemComponent } from './scheduled-item.component';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('ScheduledItemComponent', () => {
    let component: ScheduledItemComponent;
    let fixture: ComponentFixture<ScheduledItemComponent>;
    let mockScheduledBrew: ScheduledBrew = {
        id: "1",
        recipe: "1",
        recipeName: 'Test Recipe',
        date: Date.parse('2023-04-17T12:00:00Z'),
    };
    let mockScheduledBrewService: jasmine.SpyObj<ScheduledBrewService>;

    beforeEach(async () => {
        mockScheduledBrewService = jasmine.createSpyObj('ScheduledBrewService', [
            'deleteScheduledBrew',
        ]);
        await TestBed.configureTestingModule({
        declarations: [ScheduledItemComponent],
        providers: [
            { provide: ScheduledBrewService, useValue: mockScheduledBrewService },
        ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScheduledItemComponent);
        component = fixture.componentInstance;
        component.brewing = mockScheduledBrew;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render scheduled brew details', () => {
        const idElement = fixture.debugElement.query(By.css('td:nth-child(1)'));
        const recipeNameElement = fixture.debugElement.query(By.css('td:nth-child(2)'));
        const dateElement = fixture.debugElement.query(By.css('td:nth-child(3)'));

        expect(idElement.nativeElement.textContent).toContain(mockScheduledBrew.id);
        expect(recipeNameElement.nativeElement.textContent).toContain(
        mockScheduledBrew.recipeName
        );
        expect(dateElement.nativeElement.textContent).toContain('Apr 17, 2023');
    });

    it('should call deleteScheduledBrew method when delete button is clicked',() => {
        mockScheduledBrewService.deleteScheduledBrew.and.returnValue(
            of(mockScheduledBrew)
        );

        const deleteButton = fixture.debugElement.query(By.css('#delete')).nativeElement;
        deleteButton.click();

        expect(mockScheduledBrewService.deleteScheduledBrew).toHaveBeenCalledWith(
            mockScheduledBrew
        );
    });

    it('should handle error when deleteScheduledBrew method fails', fakeAsync(() => {
        const mockError = new Error('Delete failed');
        spyOn(window, 'alert');
        mockScheduledBrewService.deleteScheduledBrew.and.returnValue(
            throwError(() => mockError)
        );

        const deleteButton = fixture.debugElement.query(By.css('#delete')).nativeElement;
        deleteButton.click();

        expect(mockScheduledBrewService.deleteScheduledBrew).toHaveBeenCalledWith(
        mockScheduledBrew
        );

        tick();

        expect(window.alert).toHaveBeenCalledWith(mockError.message);
    }));

    it('should not call deleteScheduledBrew when brewing is undefined', () => {
        component.brewing = undefined;
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('#delete')).nativeElement;
        deleteButton.click();

        expect(mockScheduledBrewService.deleteScheduledBrew).not.toHaveBeenCalled();
    });
});
