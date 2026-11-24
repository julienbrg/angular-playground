import { Component, ElementRef, HostListener, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  menuOpen = false;

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
