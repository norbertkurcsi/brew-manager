import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
    let component: FilterComponent;
    let fixture: ComponentFixture<FilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(FilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit search string on valueChange', () => {
        const searchString = 'test search';
        const searchSubject = new Subject<string>();
        spyOn(searchSubject, 'next');

        component.search = searchSubject;

        const input = fixture.nativeElement.querySelector('input');
        input.value = searchString;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        fixture.detectChanges();

        expect(searchSubject.next).toHaveBeenCalledWith(searchString);
    });
});