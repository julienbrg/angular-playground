import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand and the menu button', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('Angular Playground');
    expect(compiled.querySelector('button.burger')).toBeTruthy();
  });

  it('should open the menu with a link to /new', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.menu-content')).toBeNull();
    (compiled.querySelector('button.burger') as HTMLButtonElement).click();
    fixture.detectChanges();
    const link = compiled.querySelector('.menu-content a');
    expect(link?.textContent).toContain('New');
    expect(link?.getAttribute('href')).toBe('/new');
  });
});
