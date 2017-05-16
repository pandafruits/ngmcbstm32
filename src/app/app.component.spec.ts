import {AppComponent} from './app.component';
import {TestBed, async} from '@angular/core/testing';

describe('hello component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ]
    });
    TestBed.compileComponents();
  }));

  it('should render hello world', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const hello = fixture.nativeElement;
    expect(hello.querySelector('h1').textContent).toBe('Hello World!');
  });
});
