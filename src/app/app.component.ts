import { Component, ElementRef, HostListener, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent {
  menuOpen = false;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    const menu = this.host.nativeElement.querySelector('.menu');
    if (this.menuOpen && menu && !menu.contains(target as Node)) {
      this.closeMenu();
    }
  }
}
