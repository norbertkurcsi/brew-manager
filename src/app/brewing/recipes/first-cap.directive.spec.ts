import { Component, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FirstCapDirective } from './first-cap.directive';

describe('FirstCapDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstCapDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new FirstCapDirective(new ElementRef({}));
    expect(directive).toBeTruthy();
  });

  it('should capitalize the first letter of input', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toEqual('Test');
  });

  it('should not capitalize the first letter when input is empty', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toEqual('');
  });
});

@Component({
  template: `<input type="text" firstCap>`
})
class TestComponent {}