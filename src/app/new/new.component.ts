import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NewComponent {}
